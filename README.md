# Workforce Management System (WMS) - Capstone Project

## 1. Introduction
The Workforce Management System (WMS) is an enterprise-grade solution designed to centralize and automate core HR and operational workflows. The platform manages employee profiles, attendance ledger logs, leave processing applications, departments, and project allocations.

The system architecture utilizes an N-Tier Clean Architecture pattern consisting of an ASP.NET Core Web API backend, an Angular client frontend, and a relational SQL Server database.

---

## 2. System Requirements

### Hardware Requirements
* **RAM:** Minimum 8 GB (16 GB recommended)
* **Processor:** Intel i5 or above
* **Disk Space:** Minimum 20 GB free space

### Software Requirements
* **Operating System:** Windows 10/11 or compatible OS
* **IDE/Editors:** Visual Studio 2022 & Visual Studio Code
* **SDKs & Runtimes:** .NET SDK 8.0 & Node.js LTS (with Angular CLI)
* **Database Engine:** SQL Server 2019 or Azure SQL 

---

## 3. Project Structure
The solution folder structure follows a decoupled architecture pattern:

```text
/WMS-Solution
  ├── /WMS.API            # ASP.NET Core Web API Controllers & Configurations
  ├── /WMS.Application    # Core Business Services, DTOs, and Interfaces
  ├── /WMS.Domain         # System Entities and Repository Contracts
  ├── /WMS.Infrastructure # Entity Framework Core Context & SQL Repositories
  └── /WMS.Frontend       # Angular Feature Modules & Client Application
```

---

## 4. Local Quick Start Guide
### Step 1: Database Environment Configuration
This application utilizes environment variables to decouple configuration from source code.  
Before running the API backend, configure your target SQL Server instance using your terminal environment variables:

**Windows (PowerShell):**
```bash
$env:ConnectionStrings__DefaultConnection="Server=(localdb)\mssqllocaldb;Database=WmsCapstoneDb;Trusted_Connection=True;MultipleActiveResultSets=true"
```
**Linux / macOS:**
```Bash
export ConnectionStrings__DefaultConnection="Server=(localdb)\mssqllocaldb;Database=WmsCapstoneDb;Trusted_Connection=True;MultipleActiveResultSets=true"
```

### Step 2: Database Initialization (Code-First)
1. Open your terminal in the root directory WMS-Solution.

2. Apply the migrations to seed your database schemas:  

```Bash
dotnet ef database update --project WMS.Infrastructure --startup-project WMS.API
```

### Step 3: Boot Up the .NET Core API Backend
1. Navigate to the API project entry rim folder:

```Bash
cd WMS.API
```
2. Restore package dependencies and spin up the development engine server:  

```Bash
dotnet restore
dotnet run
```
The server application will expose its endpoints dynamically via Swagger at https://localhost:7174/swagger.

### Step 4: Boot Up the Angular UI Frontend Client
1. Navigate to your frontend workspace directory:

```Bash
cd ../WMS.Frontend
```
2. Verify your target API URL mappings inside src/environments/environment.ts:
```TypeScript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7174/api' // Adjust if your local .NET API runs on a different port
};
```
3. Install the necessary node modules and spin up the local development host server:

```Bash
npm install
ng serve --open
```
Access your secure application canvas inside your browser environment at http://localhost:4200.

---

## 5. Default Credentials & Seeding
The database contains seeded evaluation role clearances (Admin, Manager, Employee).  
You can log in using the following standard credentials:
1. * **Username**: admin@wms.com
   * **Password**: WelcomeAdmin@123<br><br>
2. * **Username**: manager@wms.com
   * **Password**: WelcomeManager@123<br><br>
3. * **Username**: employee@wms.com
   * **Password**: WelcomeEmployee@123

---

## 6. Verification Testing Workflow

To ensure all decoupled systems are working in unison, run through this end-to-end integration checklist:

1. **System Entry**: Access the portal using the default Admin credentials. You will land directly on the Executive Summary Dashboard displaying live headcount and active operational statistics.

2. **Add Employee (Transactional Check)**: Navigate to the Employee Roster tab, click ADD NEW EMPLOYEE, populate the form, and save. Verify the clean "Employee profile created successfully." toast snackbar appears.

3. **Automatic Login Provisioning Verification**: Check your local database UserLogins table. A matching entry with the new employee's email address as the username and Welcome@123 as the default hashed password has been successfully written inside an isolated SQL transaction.

4. **Edit Verification**: Click the Edit icon next to any employee profile. Verify that the form loads inside a dialog container pre-populated with existing database metrics. Modify the status or contact information and save.

5. **Project Allocation Verification**: Navigate to Project Management Hub. Under the Create New Project tab, launch a project (e.g., WMS Integration Phase 2). Under Assign Staff Member, select your newly created employee and assign them to the new project.

6. **Attendance Logging**: Log out and log back in as the new employee. Navigate to the Attendance tab. Select your work mode (WFO/WFH) and click EXECUTE CHECK-IN. Let some seconds pass, click EXECUTE CHECK-OUT, then head over to the Attendance History Logs tab to view the calculated duration row.

7. **Leaves Flow**: From the employee profile, submit a Casual Leave request. Log back in as a Manager, navigate to Leave Management Hub, open the Manager Review Board, and click Approve. Log back in as the employee to verify that the status has updated instantly to green.