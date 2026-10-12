# College Complaint Management System — Java Admin Audit Tool

## 📌 Overview
The **Java Admin Audit & SLA Tool** is an administrative console developed in **Java 21 LTS** with **zero external dependencies**. 

It functions as an internal auditor and SLA (Service Level Agreement) compliance monitor for college administrators, demonstrating enterprise multi-tier architecture:
- **Cloud Web Portal**: React 18 + Supabase deployed on Vercel for students and general users.
- **Admin Audit Engine**: Java 21 console application for administrative oversight, overdue ticket scanning, and official compliance exports.

---

## 🔒 Security & Credential Handling

1. **Strictly Read-Only**:
   - The Java program issues **only HTTP `GET` requests** to `/rest/v1/complaints`.
   - It contains zero mutation endpoints (no `POST`, `PATCH`, `PUT`, or `DELETE` on complaints).
   - Even if the code were modified, Supabase Row Level Security (RLS) protects the database at the engine level.

2. **No Service-Role Key**:
   - The tool **never** uses the Supabase service-role key.

3. **Secure Admin Authentication**:
   - The Supabase host and public anon key are loaded automatically from the local `.env.local` file.
   - When connecting in Live Cloud mode, the administrator enters their **Admin Email and Password**.
   - If executed in a native terminal, the password input is masked using `System.console().readPassword()`.
   - Credentials are exchanged directly with Supabase Auth (`/auth/v1/token?grant_type=password`) over encrypted HTTPS.
   - Passwords and access tokens are **never saved to disk or printed to the screen**.
   - If authentication fails or network is unavailable, the program automatically falls back to Offline Demo Mode so presentations never fail.

---

## 🚀 How to Run

### Method 1: One-Click Runner (Windows)
Double-click `run.bat` in this folder.

### Method 2: Command Line
Open a terminal in `java-audit-tool/` and execute:
```bash
java ComplaintAuditTool.java
```
*(Java 11+ allows directly executing `.java` source files without manual compilation).*

Or compile and run traditionally:
```bash
javac ComplaintAuditTool.java
java ComplaintAuditTool
```

---

## 🎯 Operating Modes & Features

### Startup Selection
- **[1] Offline Demo Mode**: Uses realistic pre-loaded demo tickets. Ideal for quick offline presentations.
- **[2] Live Cloud Mode**: Prompts for Admin login, connects to your live Supabase cloud database, and loads actual student complaints.

### Menu Options
1. **Active Complaints Viewer**: Formatted tabular view of current tickets with category, priority, and status.
2. **SLA Breach Scanner**: Scans unresolved tickets older than **48 hours**, flagging overdue items for administrative escalation.
3. **Department Performance Analytics**: Calculates overall resolution rate (%) and category distribution using Java Collections (`HashMap`).
4. **Complaint Search**: Instant lookup by display ID (e.g., `CMP-00001`).
5. **Official Audit Report Export**: Uses Java File I/O (`BufferedWriter`) to generate an `audit_report.txt` file on disk for official college records.
6. **Refresh Data from Cloud**: Re-fetches current live complaints from Supabase without restarting the tool.
7. **Exit**: Gracefully terminates the session.

---

## 🎓 Java Concepts Implemented (Viva Reference)

| Concept | Implementation in Code |
| :--- | :--- |
| **Object-Oriented Programming (OOP)** | `Complaint` model with private fields, parameterized constructor, and getter methods ensuring encapsulation. |
| **Collections Framework** | `List<Complaint>`, `ArrayList`, `Map<String, Integer>`, and `HashMap` used for ticket storage and aggregation. |
| **Modern Networking (`java.net.http`)** | Native Java 21 `HttpClient`, `HttpRequest`, and `HttpResponse` communicating over HTTPS with Supabase REST APIs. |
| **Modern Date & Time API** | `java.time.Instant`, `Duration`, and `DateTimeFormatter` used to compute exact ticket age and SLA breaches. |
| **File I/O** | `FileWriter` and `BufferedWriter` used with `try-with-resources` for safe report generation. |
| **Defensive Exception Handling** | Proper exception blocks ensuring network errors or invalid credentials gracefully fall back without crashing. |
