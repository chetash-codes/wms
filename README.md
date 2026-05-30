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
  ├── /WMS.Frontend       # Angular Feature Modules & Client Application
  └── /WMS.Tests          # Core xUnit Testing Engine Projectome@123
```

---

## 4. Local Quick Start Guide
### Step 1: Database Initialization (Code-First)
Open your terminal and navigate to the Infrastructure layer directory.Ensure your connection string inside WMS.API/appsettings.json points to your target local SQL Server instance.Apply the migrations to seed your database schemas:  

```Bash
dotnet ef database update --project ../WMS.Infrastructure --startup-project ../WMS.API
```

### Step 2: Boot Up the .NET Core API Backend
Navigate to the API project entry rim folder:

```Bash
cd WMS.API
```
Restore package dependencies and spin up the development engine server:  

```Bash
dotnet restore
dotnet run
```
The server application will expose its endpoints dynamically via Swagger at https://localhost:7174/swagger.

### Step 3: Boot Up the Angular UI Frontend Client
Navigate to your frontend workspace directory:

```Bash
cd ../WMS.Frontend
```
Install the necessary node modules and spin up the local development host server:

```Bash
npm install
ng serve --open
```
Access your secure application canvas inside your browser environment at http://localhost:4200.

---

## 5. Default Credentials & Seeding
The database contains seeded evaluation role clearances (Admin, Manager, Employee).
* **Username**: admin@wms.com
* **Password**: Welcome@123