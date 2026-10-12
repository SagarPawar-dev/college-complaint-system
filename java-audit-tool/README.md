# College Complaint Management System — Java Admin Audit Tool

## 📌 Overview
The **Java Admin Audit & SLA Tool** is an administrative console developed in **Java 21 LTS** with **zero external dependencies**. 

It functions as an internal auditor and SLA (Service Level Agreement) compliance monitor for college administrators, demonstrating enterprise multi-tier architecture:
- **Cloud Web Portal**: React 18 + Supabase deployed on Vercel for students and staff.
- **Admin Audit Engine**: Java 21 console application for administrative oversight, overdue ticket scanning, and official compliance exports.

---

## 🚀 How to Run

### Method 1: One-Click Runner (Windows)
Double-click `run.bat` in this folder.

### Method 2: Command Line
Open any terminal in this directory and execute:
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

## 🎯 Features

1. **Active Complaints Viewer**: Formatted tabular view of current tickets with category, priority, and status.
2. **SLA Breach Scanner**: Automatically checks tickets that have been unresolved for more than **48 hours**, flagging them for administrative escalation.
3. **Department Performance Analytics**: Calculates overall resolution rate (%) and category distribution using Java Collections (`HashMap`).
4. **Complaint Search**: Instant lookup by ID (`CMP-00001`).
5. **Official Audit Report Export**: Uses Java File I/O (`BufferedWriter`) to generate an `audit_report.txt` file on disk for official college records.

---

## 🎓 Java Concepts Implemented (Viva Reference)

| Concept | Implementation in Code |
| :--- | :--- |
| **Object-Oriented Programming (OOP)** | `Complaint` model with private fields, parameterized constructor, and getter methods ensuring encapsulation. |
| **Collections Framework** | `List<Complaint>`, `ArrayList`, `Map<String, Integer>`, and `HashMap` used for ticket storage and aggregation. |
| **Modern Date & Time API** | `java.time.Instant`, `Duration`, and `DateTimeFormatter` used to compute exact ticket age and SLA breaches. |
| **File I/O** | `FileWriter` and `BufferedWriter` used with `try-with-resources` for safe report generation. |
| **Defensive Exception Handling** | Proper exception blocks ensuring the console never crashes unexpectedly. |

---

## 🔒 Security & System Safety
- **Read-Only**: The tool performs no mutation, update, or deletion operations.
- **Non-Destructive**: Leaves all database records, RLS policies, and web app components completely untouched.
