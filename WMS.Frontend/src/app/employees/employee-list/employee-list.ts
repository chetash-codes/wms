import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../services/employee';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeForm } from '../employee-form/employee-form';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
  standalone: false
})
export class EmployeeList implements OnInit {
  displayedColumns: string[] = ['employeeId', 'name', 'email', 'phoneNumber', 'status', 'actions'];
  dataSource: Employee[] = [];

  // Interactive search bindings 
  searchName: string = '';
  searchDept: number | undefined;
  searchRole: number | undefined;

  // RBAC Flags
  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // 1. Establish User Clearance
    const userRole = this.authService.getUserRole();
    this.isAdmin = userRole === 'Admin';
    this.isManager = userRole === 'Manager';

    // 2. Clean up UI for standard employees by removing the Actions column
    if (!this.isAdmin && !this.isManager) {
      this.displayedColumns = ['employeeId', 'name', 'email', 'phoneNumber', 'status'];
    }

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.searchEmployees(this.searchName, this.searchDept, this.searchRole)
      .subscribe({
        next: (data) => {
          this.dataSource = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to retrieve employee rosters:', err)
      });
  }

  openAddEmployeeDialog(employeeData?: any): void {
    const dialogRef = this.dialog.open(EmployeeForm, {
      width: '500px',
      disableClose: true, // Prevents accidental closing by clicking outside
      data: employeeData
    });

    // Automatically refresh the roster list if a new employee was saved successfully
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadEmployees();
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    this.loadEmployees();
  }

  onClear(): void {
    this.searchName = '';
    this.searchDept = undefined;
    this.searchRole = undefined;
    this.loadEmployees();
  }
}
