import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../services/employee';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeForm } from '../employee-form/employee-form';

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

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
