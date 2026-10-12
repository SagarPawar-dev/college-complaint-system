import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
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

/**
 * ============================================================================
 * College Complaint Management System - Admin Audit & SLA Monitoring Tool
 * ============================================================================
 * Language: Java 21 (No external dependencies)
 * Mode: Read-Only Audit & Compliance Console
 * 
 * Demonstrates:
 * 1. Object-Oriented Programming (Classes, Encapsulation, Methods)
 * 2. Java Collections Framework (List, Map, ArrayList, HashMap)
 * 3. Java Date & Time API (Instant, Duration, DateTimeFormatter)
 * 4. File I/O (FileWriter, BufferedWriter)
 * 5. Defensive Exception Handling (try-catch-finally)
 * ============================================================================
 */
public class ComplaintAuditTool {

    // Threshold in hours to consider an unresolved ticket an "SLA Breach"
    private static final long SLA_HOURS_THRESHOLD = 48;

    // In-memory list of complaints for read-only analysis
    private final List<Complaint> complaints = new ArrayList<>();

    public static void main(String[] args) {
        ComplaintAuditTool app = new ComplaintAuditTool();
        app.loadInitialData();
        app.runInteractiveConsole();
    }

    /**
     * Initializes the tool with sample demo complaints.
     * In the next step, this will connect securely to Supabase via authenticated REST API.
     */
    public void loadInitialData() {
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
    public void runInteractiveConsole() {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        printHeader();

        while (running) {
            System.out.println("\n------------------------------------------------------------");
            System.out.println("                   ADMINISTRATIVE MENU                      ");
            System.out.println("------------------------------------------------------------");
            System.out.println(" [1] View All Active Complaints");
            System.out.println(" [2] Scan for Overdue SLA Breaches (>48h)");
            System.out.println(" [3] Department Performance & Resolution Summary");
            System.out.println(" [4] Search Complaint by ID (e.g. CMP-00001)");
            System.out.println(" [5] Export Official Audit Report to File (.txt)");
            System.out.println(" [6] Exit");
            System.out.print("\nEnter your choice (1-6): ");

            String input = scanner.nextLine().trim();

            switch (input) {
                case "1" -> displayAllComplaints();
                case "2" -> scanSlaBreaches();
                case "3" -> displayDepartmentMetrics();
                case "4" -> searchComplaintById(scanner);
                case "5" -> exportAuditReportToFile();
                case "6" -> {
                    System.out.println("\nThank you for using the Java Admin Audit Tool. Goodbye!");
                    running = false;
                }
                default -> System.out.println("[!] Invalid option. Please enter a number between 1 and 6.");
            }
        }
    }

    private void printHeader() {
        System.out.println("============================================================");
        System.out.println("   COLLEGE COMPLAINT MANAGEMENT SYSTEM - AUDIT CONSOLE      ");
        System.out.println("============================================================");
        System.out.println(" Powered by: Java 21 (Standard Edition)");
        System.out.println(" Security Profile: READ-ONLY AUDITOR (Zero modifications)");
        System.out.printf(" Records Loaded: %d complaints\n", complaints.size());
    }

    /**
     * Feature 1: Display all complaints formatted in a clean table.
     */
    private void displayAllComplaints() {
        System.out.println("\n--- ALL COMPLAINTS ---");
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
