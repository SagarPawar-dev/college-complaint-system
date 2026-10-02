# College Complaint Management System

A modern, transparent, and secure web application for colleges to manage and track campus issues (e.g., IT, Maintenance, Facilities). 

Built with React (Vite) and powered by Supabase (PostgreSQL), this system features real-time issue tracking, strict role-based access control, and enterprise-grade Row Level Security (RLS).


## ✨ Features

- **Role-Based Workflows:** Distinct experiences for `Students` and `Administrators`.
- **Student Portal:** Students can securely report issues, track status updates, and reopen resolved complaints if an issue persists.
- **Admin Dashboard:** Administrators can view all campus complaints, update statuses (In Progress, Resolved, etc.), and add official responses.
- **Activity Timeline:** Every complaint features a full audit log of status changes and responses.
- **Enterprise Security:** The frontend is completely protected by **PostgreSQL Row Level Security (RLS)**. Students can *only* access their own data, and privileges cannot be escalated via API bypassing.
- **Automated Notifications:** Database triggers automatically alert admins when new complaints are filed.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router DOM, Context API
- **Backend/Database:** Supabase, PostgreSQL
- **Security:** JWT Authentication, Row Level Security (RLS)
- **Styling:** Vanilla CSS (Custom Design System), Lucide React (Icons)
- **Hosting:** Vercel (Frontend), Supabase (Backend)

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "Complaint management"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Database Setup:**
   *Note: To run this project from scratch, the Supabase PostgreSQL schema, RPC functions, and RLS policies must be applied via the Supabase SQL editor.*

---
*Developed as a college mini-project.*
