import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * ============================================================================
 * College Complaint Management System - Admin Audit & SLA Monitoring Tool
 * ============================================================================
 * Language: Java 21 LTS (Zero external dependencies)
 * Security Profile: STRICT READ-ONLY AUDITOR (HTTP GET only, Zero Mutations)
 * Authentication: Supabase Auth Password Grant (Admin Session JWT)
 * 
 * Features:
 * 1. Dual Mode: Offline Sample Data & Live Cloud Supabase Connection
 * 2. SLA Breach Scanner (Flags tickets unresolved >48 hours)
 * 3. Department Resolution & Category Metrics
 * 4. Ticket Search by Display ID (e.g., CMP-00001)
 * 5. Official Audit Report File Generation (.txt)
 * ============================================================================
 */
public class ComplaintAuditTool {

    // Threshold in hours to consider an unresolved ticket an "SLA Breach"
    private static final long SLA_HOURS_THRESHOLD = 48;

    // HTTP Client for safe REST calls
    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    // In-memory complaint records for read-only audit analysis
    private final List<Complaint> complaints = new ArrayList<>();

    // Supabase credentials loaded securely from local environment
    private String supabaseUrl = "";
    private String supabaseAnonKey = "";
    private String adminAccessToken = null; // Transient in memory only (never logged/saved)
    private String activeDataSource = "Sample Demo Data";

    public static void main(String[] args) {
        ComplaintAuditTool app = new ComplaintAuditTool();
        app.start();
    }

    public void start() {
        Scanner scanner = new Scanner(System.in);
        printHeader();

        // Prompt user to select Data Source
        System.out.println("Select Data Source:");
        System.out.println(" [1] Offline Demo Mode (Instant, uses realistic sample complaints)");
        System.out.println(" [2] Live Cloud Mode (Connects to Supabase via Admin Login)");
        System.out.print("\nEnter choice (1 or 2) [Default: 1]: ");

        String choice = scanner.nextLine().trim();

        if ("2".equals(choice)) {
            boolean connected = connectToLiveSupabase(scanner);
            if (!connected) {
                System.out.println("\n[!] Falling back to Offline Demo Mode for safe demonstration.");
                loadSampleData();
            }
        } else {
            loadSampleData();
        }

        runInteractiveConsole(scanner);
    }

    /**
     * Connects securely to Supabase using Admin credentials.
     * Never prints or persists passwords or access tokens.
     */
    private boolean connectToLiveSupabase(Scanner scanner) {
        System.out.println("\n------------------------------------------------------------");
        System.out.println("            SUPABASE CLOUD AUTHENTICATION SETUP             ");
        System.out.println("------------------------------------------------------------");

        // Step 1: Locate Supabase config from .env.local
        boolean configFound = loadSupabaseConfig();
        if (!configFound) {
            System.out.println("[ERROR] Could not automatically locate .env.local.");
            System.out.print("Enter your Supabase URL (e.g. https://xxx.supabase.co): ");
            this.supabaseUrl = scanner.nextLine().trim();
            System.out.print("Enter your Supabase Anon Key: ");
            this.supabaseAnonKey = scanner.nextLine().trim();
        }

        if (this.supabaseUrl.isEmpty() || this.supabaseAnonKey.isEmpty()) {
            System.out.println("[ERROR] Missing Supabase URL or Anon Key.");
            return false;
        }

        System.out.printf("Target Supabase Host : %s\n", this.supabaseUrl);
        System.out.println("Authentication Type  : Secure Password Grant (Admin Session)");
        System.out.println("Permission Level     : Strictly READ-ONLY (GET requests only)");
        System.out.println("------------------------------------------------------------");

        // Step 2: Prompt for Admin Credentials safely
        System.out.print("Enter Admin Email: ");
        String email = scanner.nextLine().trim();

        String password = "";
        if (System.console() != null) {
            char[] passArray = System.console().readPassword("Enter Admin Password: ");
            if (passArray != null) {
                password = new String(passArray);
            }
        } else {
            System.out.print("Enter Admin Password: ");
            password = scanner.nextLine();
        }

        if (email.isEmpty() || password.isEmpty()) {
            System.out.println("[ERROR] Email and password cannot be empty.");
            return false;
        }

        // Step 3: Request temporary JWT from Supabase Auth
        System.out.println("\nAuthenticating with Supabase Auth...");
        String token = requestAdminToken(email, password);

        if (token == null) {
            return false;
        }

        this.adminAccessToken = token;
        System.out.println("[SUCCESS] Authenticated successfully as Admin!");

        // Step 4: Fetch live complaints (Read-Only HTTP GET)
        System.out.println("Fetching complaints from cloud database...");
        boolean fetched = fetchLiveComplaints();

        if (fetched) {
            this.activeDataSource = "Live Supabase Cloud (" + this.supabaseUrl + ")";
            System.out.printf("[SUCCESS] Loaded %d live complaints from database.\n", complaints.size());
            return true;
        } else {
            return false;
        }
    }

    /**
     * Reads Supabase URL and anon key from local .env.local file.
     * Does NOT touch or modify the file.
     */
    private boolean loadSupabaseConfig() {
        Path[] candidatePaths = new Path[] {
            Paths.get(".env.local"),
            Paths.get("../.env.local"),
            Paths.get("../../.env.local")
        };

        for (Path path : candidatePaths) {
            if (Files.exists(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("VITE_SUPABASE_URL=")) {
                            this.supabaseUrl = cleanEnvValue(trimmed.substring("VITE_SUPABASE_URL=".length()));
                        } else if (trimmed.startsWith("VITE_SUPABASE_ANON_KEY=")) {
                            this.supabaseAnonKey = cleanEnvValue(trimmed.substring("VITE_SUPABASE_ANON_KEY=".length()));
                        }
                    }
                    if (!this.supabaseUrl.isEmpty() && !this.supabaseAnonKey.isEmpty()) {
                        return true;
                    }
                } catch (IOException ignored) {}
            }
        }
        return false;
    }

    private String cleanEnvValue(String raw) {
        String cleaned = raw.trim();
        if ((cleaned.startsWith("\"") && cleaned.endsWith("\"")) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.substring(1, cleaned.length() - 1);
        }
        return cleaned.trim();
    }

    /**
     * Performs Supabase Auth token request.
     * POST /auth/v1/token?grant_type=password
     */
    private String requestAdminToken(String email, String password) {
        try {
            String endpoint = this.supabaseUrl + "/auth/v1/token?grant_type=password";
            String jsonPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\"}",
                escapeJson(email), escapeJson(password));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("apikey", this.supabaseAnonKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .timeout(Duration.ofSeconds(15))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Extract access_token securely (never printed or stored on disk)
                Pattern pattern = Pattern.compile("\"access_token\"\\s*:\\s*\"([^\"]+)\"");
                Matcher matcher = pattern.matcher(response.body());
                if (matcher.find()) {
                    return matcher.group(1);
                } else {
                    System.out.println("[ERROR] Access token not found in authentication response.");
                    return null;
                }
            } else {
                System.out.printf("[ERROR] Authentication failed (HTTP %d).\n", response.statusCode());
                if (response.body().contains("Invalid login credentials")) {
                    System.out.println("Reason: Invalid email or password.");
                } else {
                    System.out.println("Please verify admin account credentials in Supabase.");
                }
                return null;
            }
        } catch (Exception e) {
            System.out.printf("[ERROR] Network error during authentication: %s\n", e.getMessage());
            return null;
        }
    }

    /**
     * Strictly READ-ONLY fetch of all complaints via Supabase REST API.
     * GET /rest/v1/complaints
     */
    private boolean fetchLiveComplaints() {
        try {
            String endpoint = this.supabaseUrl + "/rest/v1/complaints" +
                "?select=id,display_id,title,description,category,priority,status,created_at,profiles(name)" +
                "&order=created_at.desc";

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("apikey", this.supabaseAnonKey)
                .header("Authorization", "Bearer " + this.adminAccessToken)
                .header("Accept", "application/json")
                .GET() // Strictly READ-ONLY GET request
                .timeout(Duration.ofSeconds(15))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                List<Complaint> fetched = parseComplaintsJson(response.body());
                this.complaints.clear();
                this.complaints.addAll(fetched);
                return true;
            } else {
                System.out.printf("[ERROR] Failed to query complaints (HTTP %d).\n", response.statusCode());
                return false;
            }
        } catch (Exception e) {
            System.out.printf("[ERROR] Network error during query: %s\n", e.getMessage());
            return false;
        }
    }

    /**
     * Lightweight, dependency-free JSON parser for Supabase complaints array.
     * Safely handles nested objects, escaped characters, quotes, and missing fields.
     */
    private List<Complaint> parseComplaintsJson(String json) {
        List<Complaint> list = new ArrayList<>();
        if (json == null || json.trim().isEmpty() || json.trim().equals("[]")) {
            return list;
        }

        // Extract top-level {...} objects using brace counting & escape tracking
        int depth = 0;
        StringBuilder current = new StringBuilder();
        boolean inString = false;

        for (int i = 0; i < json.length(); i++) {
            char ch = json.charAt(i);

            if (ch == '\"' && !isEscaped(json, i)) {
                inString = !inString;
            }

            if (!inString) {
                if (ch == '{') {
                    depth++;
                    if (depth == 1) {
                        current.setLength(0);
                        continue;
                    }
                } else if (ch == '}') {
                    depth--;
                    if (depth == 0) {
                        Complaint c = parseComplaintObject(current.toString());
                        if (c != null) {
                            list.add(c);
                        }
                        current.setLength(0);
                        continue;
                    }
                }
            }

            if (depth >= 1) {
                current.append(ch);
            }
        }

        return list;
    }

    private boolean isEscaped(String str, int index) {
        int backslashes = 0;
        for (int i = index - 1; i >= 0 && str.charAt(i) == '\\'; i--) {
            backslashes++;
        }
        return (backslashes % 2) != 0;
    }

    private Complaint parseComplaintObject(String objStr) {
        try {
            String displayId = extractDisplayId(objStr);
            String title = extractStringField(objStr, "title", "Untitled Complaint");
            String description = extractStringField(objStr, "description", "No description provided");
            String category = extractStringField(objStr, "category", "General");
            String priority = extractStringField(objStr, "priority", "MEDIUM");
            String status = extractStringField(objStr, "status", "submitted");
            String studentName = extractProfileName(objStr, "Anonymous Student");
            Instant createdAt = extractInstantField(objStr, "created_at");

            return new Complaint(displayId, title, description, category, priority, status, studentName, createdAt);
        } catch (Exception e) {
            return null;
        }
    }

    private String extractDisplayId(String source) {
        // Handles numeric display_id: "display_id": 12
        Pattern numPattern = Pattern.compile("\"display_id\"\\s*:\\s*(\\d+)");
        Matcher numMatcher = numPattern.matcher(source);
        if (numMatcher.find()) {
            long num = Long.parseLong(numMatcher.group(1));
            return String.format("CMP-%05d", num);
        }

        // Handles string display_id: "display_id": "CMP-00012" or "display_id": "12"
        Pattern strPattern = Pattern.compile("\"display_id\"\\s*:\\s*\"([^\"]+)\"");
        Matcher strMatcher = strPattern.matcher(source);
        if (strMatcher.find()) {
            String val = strMatcher.group(1).trim();
            if (val.toUpperCase().startsWith("CMP-")) {
                return val.toUpperCase();
            }
            try {
                long num = Long.parseLong(val);
                return String.format("CMP-%05d", num);
            } catch (NumberFormatException ignored) {
                return val;
            }
        }
        return "CMP-00000";
    }

    private String extractStringField(String source, String fieldName, String defaultVal) {
        Pattern pattern = Pattern.compile("\"" + fieldName + "\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(source);
        if (matcher.find()) {
            return unescapeJson(matcher.group(1)).trim();
        }
        return defaultVal;
    }

    private String extractProfileName(String source, String defaultVal) {
        // Specifically searches inside "profiles": { "name": "..." } or "profiles": [ { "name": "..." } ]
        Pattern profileBlockPattern = Pattern.compile("\"profiles\"\\s*:\\s*([{\\[][^}\\]]*[}\\]])", Pattern.DOTALL);
        Matcher blockMatcher = profileBlockPattern.matcher(source);
        if (blockMatcher.find()) {
            String profileBlock = blockMatcher.group(1);
            Pattern namePattern = Pattern.compile("\"name\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"", Pattern.DOTALL);
            Matcher nameMatcher = namePattern.matcher(profileBlock);
            if (nameMatcher.find()) {
                String name = unescapeJson(nameMatcher.group(1)).trim();
                if (!name.isEmpty()) {
                    return name;
                }
            }
        }
        return defaultVal;
    }

    private Instant extractInstantField(String source, String fieldName) {
        Pattern pattern = Pattern.compile("\"" + fieldName + "\"\\s*:\\s*\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(source);
        if (matcher.find()) {
            try {
                return Instant.parse(matcher.group(1));
            } catch (Exception ignored) {}
        }
        return Instant.now();
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        return raw.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String unescapeJson(String raw) {
        if (raw == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            if (c == '\\' && i + 1 < raw.length()) {
                char next = raw.charAt(i + 1);
                switch (next) {
                    case '"' -> { sb.append('"'); i++; }
                    case '\\' -> { sb.append('\\'); i++; }
                    case '/' -> { sb.append('/'); i++; }
                    case 'n' -> { sb.append(' '); i++; } // Replace newlines with space for clean tabular view
                    case 'r' -> { i++; }
                    case 't' -> { sb.append("  "); i++; }
                    case 'u' -> {
                        if (i + 5 < raw.length()) {
                            try {
                                int code = Integer.parseInt(raw.substring(i + 2, i + 6), 16);
                                sb.append((char) code);
                                i += 5;
                            } catch (NumberFormatException e) {
                                sb.append(c);
                            }
                        } else {
                            sb.append(c);
                        }
                    }
                    default -> sb.append(c);
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    /**
     * Loads realistic sample demo data.
     */
    public void loadSampleData() {
        this.activeDataSource = "Sample Demo Data (Offline Mode)";
        complaints.clear();
        complaints.add(new Complaint(
            "CMP-00001",
            "Classroom Projector Not Working",
            "Projector in Room 302 HDMI port is damaged and flickering during lectures.",
            "Infrastructure",
            "HIGH",
            "submitted",
            "Sagar Pawar",
            Instant.now().minus(Duration.ofHours(54)) // 54 hours ago -> Overdue SLA
        ));

        complaints.add(new Complaint(
            "CMP-00002",
            "Library Wi-Fi Connectivity Drop",
            "Frequent Wi-Fi disconnections on 2nd floor study section.",
            "Technical",
            "MEDIUM",
            "in_progress",
            "Rahul Sharma",
            Instant.now().minus(Duration.ofHours(26)) // 26 hours ago -> Within SLA
        ));

        complaints.add(new Complaint(
            "CMP-00003",
            "Hostel Mess Water Dispenser Leakage",
            "Drinking water cooler on Ground Floor Block B has continuous leakage.",
            "Hostel",
            "HIGH",
            "resolved",
            "Amit Patel",
            Instant.now().minus(Duration.ofHours(72)) // Resolved
        ));

        complaints.add(new Complaint(
            "CMP-00004",
            "Lab 4 Python Environment Not Configured",
            "Systems 12 to 18 lack necessary packages for AI lab assignment.",
            "Academic",
            "LOW",
            "closed",
            "Sneha Kulkarni",
            Instant.now().minus(Duration.ofHours(96)) // Closed
        ));
    }

    /**
     * Interactive command line menu.
     */
    public void runInteractiveConsole(Scanner scanner) {
        boolean running = true;

        while (running) {
            System.out.println("\n------------------------------------------------------------");
            System.out.printf("   ADMINISTRATIVE MENU  [%s]\n", this.activeDataSource);
            System.out.println("------------------------------------------------------------");
            System.out.println(" [1] View All Active Complaints");
            System.out.println(" [2] Scan for Overdue SLA Breaches (>48h)");
            System.out.println(" [3] Department Performance & Resolution Summary");
            System.out.println(" [4] Search Complaint by ID (e.g. CMP-00001)");
            System.out.println(" [5] Export Official Audit Report to File (.txt)");
            System.out.println(" [6] Refresh Data from Cloud");
            System.out.println(" [7] Exit");
            System.out.print("\nEnter your choice (1-7): ");

            String input = scanner.nextLine().trim();

            switch (input) {
                case "1" -> displayAllComplaints();
                case "2" -> scanSlaBreaches();
                case "3" -> displayDepartmentMetrics();
                case "4" -> searchComplaintById(scanner);
                case "5" -> exportAuditReportToFile();
                case "6" -> refreshData();
                case "7" -> {
                    System.out.println("\nThank you for using the Java Admin Audit Tool. Goodbye!");
                    running = false;
                }
                default -> System.out.println("[!] Invalid option. Please enter a number between 1 and 7.");
            }
        }
    }

    private void printHeader() {
        System.out.println("============================================================");
        System.out.println("   COLLEGE COMPLAINT MANAGEMENT SYSTEM - AUDIT CONSOLE      ");
        System.out.println("============================================================");
        System.out.println(" Powered by: Java 21 LTS (Zero External Dependencies)");
        System.out.println(" Security Profile: STRICT READ-ONLY AUDITOR");
        System.out.println("============================================================");
    }

    private void refreshData() {
        if (this.adminAccessToken != null) {
            System.out.println("\nRefreshing data from Supabase Cloud...");
            boolean ok = fetchLiveComplaints();
            if (ok) {
                System.out.printf("[SUCCESS] Refreshed %d complaints from database.\n", complaints.size());
            }
        } else {
            System.out.println("\nCurrently running in Offline Mode. Reloaded sample complaints.");
            loadSampleData();
        }
    }

    /**
     * Feature 1: Display all complaints formatted in a clean table.
     */
    private void displayAllComplaints() {
        System.out.println("\n--- ALL COMPLAINTS ---");
        if (complaints.isEmpty()) {
            System.out.println("No complaint records currently available.");
            return;
        }

        System.out.printf("%-11s | %-14s | %-8s | %-12s | %-30s\n", 
            "ID", "Category", "Priority", "Status", "Title");
        System.out.println("-".repeat(85));

        for (Complaint c : complaints) {
            String shortTitle = c.getTitle().length() > 28 
                ? c.getTitle().substring(0, 25) + "..." 
                : c.getTitle();

            System.out.printf("%-11s | %-14s | %-8s | %-12s | %-30s\n",
                c.getDisplayId(),
                c.getCategory(),
                c.getPriority(),
                c.getStatus(),
                shortTitle
            );
        }
    }

    /**
     * Feature 2: Scan for unresolved complaints older than 48 hours.
     */
    private void scanSlaBreaches() {
        System.out.println("\n============================================================");
        System.out.printf(" SLA BREACH SCAN (Tickets Unresolved for > %d Hours)\n", SLA_HOURS_THRESHOLD);
        System.out.println("============================================================");

        Instant now = Instant.now();
        int breachCount = 0;

        for (Complaint c : complaints) {
            if (c.isUnresolved()) {
                long hoursOpen = Duration.between(c.getCreatedAt(), now).toHours();
                if (hoursOpen >= SLA_HOURS_THRESHOLD) {
                    breachCount++;
                    System.out.printf("\n[SLA BREACH ALERT #%d]\n", breachCount);
                    System.out.printf("  Ticket ID   : %s\n", c.getDisplayId());
                    System.out.printf("  Title       : %s\n", c.getTitle());
                    System.out.printf("  Student     : %s\n", c.getStudentName());
                    System.out.printf("  Category    : %s\n", c.getCategory());
                    System.out.printf("  Priority    : %s\n", c.getPriority());
                    System.out.printf("  Status      : %s\n", c.getStatus());
                    System.out.printf("  Hours Open  : %d hours (Exceeded SLA limit by %d hrs)\n", 
                        hoursOpen, (hoursOpen - SLA_HOURS_THRESHOLD));
                }
            }
        }

        if (breachCount == 0) {
            System.out.println("[OK] All active complaints are within the 48-hour SLA resolution window!");
        } else {
            System.out.println("-".repeat(60));
            System.out.printf("Total SLA Breaches Detected: %d\n", breachCount);
            System.out.println("Action Recommended: Notify Department Heads for immediate escalation.");
        }
    }

    /**
     * Feature 3: Calculate department resolution rate and category counts.
     */
    private void displayDepartmentMetrics() {
        System.out.println("\n--- DEPARTMENT PERFORMANCE & RESOLUTION METRICS ---");

        int total = complaints.size();
        if (total == 0) {
            System.out.println("No records available to calculate metrics.");
            return;
        }

        int resolvedOrClosed = 0;
        Map<String, Integer> categoryDistribution = new HashMap<>();

        for (Complaint c : complaints) {
            if (!c.isUnresolved()) {
                resolvedOrClosed++;
            }
            categoryDistribution.put(c.getCategory(), 
                categoryDistribution.getOrDefault(c.getCategory(), 0) + 1);
        }

        double resolutionRate = ((double) resolvedOrClosed / total) * 100.0;

        System.out.printf("Total Complaints Recorded : %d\n", total);
        System.out.printf("Resolved / Closed Tickets : %d\n", resolvedOrClosed);
        System.out.printf("Active / Pending Tickets  : %d\n", (total - resolvedOrClosed));
        System.out.printf("System Resolution Rate    : %.1f%%\n", resolutionRate);

        System.out.println("\nBreakdown by Category:");
        for (Map.Entry<String, Integer> entry : categoryDistribution.entrySet()) {
            double percent = ((double) entry.getValue() / total) * 100.0;
            System.out.printf("  %-16s : %2d tickets (%.1f%%)\n", 
                entry.getKey(), entry.getValue(), percent);
        }
    }

    /**
     * Feature 4: Search complaint by display ID.
     */
    private void searchComplaintById(Scanner scanner) {
        System.out.print("\nEnter Complaint ID to search (e.g. CMP-00001): ");
        String query = scanner.nextLine().trim();

        Complaint found = null;
        for (Complaint c : complaints) {
            if (c.getDisplayId().equalsIgnoreCase(query)) {
                found = c;
                break;
            }
        }

        if (found != null) {
            System.out.println("\n--- TICKET DETAILS FOUND ---");
            System.out.printf("ID          : %s\n", found.getDisplayId());
            System.out.printf("Title       : %s\n", found.getTitle());
            System.out.printf("Category    : %s\n", found.getCategory());
            System.out.printf("Priority    : %s\n", found.getPriority());
            System.out.printf("Status      : %s\n", found.getStatus());
            System.out.printf("Student     : %s\n", found.getStudentName());
            System.out.printf("Created At  : %s\n", formatTimestamp(found.getCreatedAt()));
            System.out.printf("Description : %s\n", found.getDescription());
        } else {
            System.out.printf("[!] Complaint with ID '%s' was not found.\n", query);
        }
    }

    /**
     * Feature 5: Export a formatted audit report to a physical text file.
     */
    private void exportAuditReportToFile() {
        String fileName = "audit_report.txt";
        System.out.printf("\nGenerating official audit report '%s'...\n", fileName);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String generatedAt = LocalDateTime.now().format(dtf);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            writer.write("================================================================================\n");
            writer.write("             COLLEGE COMPLAINT MANAGEMENT SYSTEM - AUDIT DIGEST                 \n");
            writer.write("================================================================================\n");
            writer.write("Report Generated On : " + generatedAt + "\n");
            writer.write("Data Source         : " + this.activeDataSource + "\n");
            writer.write("Audit Engine        : Java 21 LTS Standard Auditor\n");
            writer.write("Audit Permission    : READ-ONLY ENFORCED\n");
            writer.write("Total Records       : " + complaints.size() + "\n");
            writer.write("--------------------------------------------------------------------------------\n\n");

            writer.write(String.format("%-11s | %-14s | %-8s | %-12s | %-30s\n", 
                "ID", "Category", "Priority", "Status", "Title"));
            writer.write("-".repeat(85) + "\n");

            for (Complaint c : complaints) {
                String shortTitle = c.getTitle().length() > 28 
                    ? c.getTitle().substring(0, 25) + "..." 
                    : c.getTitle();

                writer.write(String.format("%-11s | %-14s | %-8s | %-12s | %-30s\n",
                    c.getDisplayId(),
                    c.getCategory(),
                    c.getPriority(),
                    c.getStatus(),
                    shortTitle
                ));
            }

            writer.write("\n================================================================================\n");
            writer.write("END OF OFFICIAL AUDIT DIGEST - VERIFIED BY ADMINISTRATIVE SYSTEM\n");
            writer.write("================================================================================\n");

            System.out.printf("[SUCCESS] Audit report successfully exported to: %s\n", fileName);
        } catch (IOException e) {
            System.err.printf("[ERROR] Failed to write report file: %s\n", e.getMessage());
        }
    }

    private String formatTimestamp(Instant instant) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")
            .withZone(ZoneId.systemDefault());
        return formatter.format(instant);
    }

    // ========================================================================
    // MODEL CLASS (Demonstrates OOP Encapsulation & Data Modeling)
    // ========================================================================
    public static class Complaint {
        private final String displayId;
        private final String title;
        private final String description;
        private final String category;
        private final String priority;
        private final String status;
        private final String studentName;
        private final Instant createdAt;

        public Complaint(String displayId, String title, String description, 
                         String category, String priority, String status, 
                         String studentName, Instant createdAt) {
            this.displayId = displayId;
            this.title = title;
            this.description = description;
            this.category = category;
            this.priority = priority;
            this.status = status;
            this.studentName = studentName;
            this.createdAt = createdAt;
        }

        public String getDisplayId() { return displayId; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public String getPriority() { return priority; }
        public String getStatus() { return status; }
        public String getStudentName() { return studentName; }
        public Instant getCreatedAt() { return createdAt; }

        public boolean isUnresolved() {
            return !"resolved".equalsIgnoreCase(status) && !"closed".equalsIgnoreCase(status);
        }
    }
}
