import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService, Department } from '../services/department';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-department-dashboard',
  templateUrl: './department-dashboard.html',
  styleUrls: ['./department-dashboard.css'],
  standalone: false
})
export class DepartmentDashboard implements OnInit {
  displayedColumns: string[] = ['departmentId', 'departmentName', 'description', 'createdOn'];
  dataSource: Department[] = [];
  deptForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deptService: DepartmentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm(): void {
    this.deptForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  loadDepartments(): void {
    this.deptService.getDepartments().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load departments:', err)
    });
  }

  onSubmit(): void {
    if (this.deptForm.invalid) return;

    this.deptService.createDepartment(this.deptForm.value).subscribe({
      next: () => {
        this.snackBar.open('Department added successfully!', 'Close', { duration: 3000 });
        this.deptForm.reset();
        this.loadDepartments(); // Instantly refresh the data table grid view
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to add department.', 'Close', { duration: 3000 });
      }
    });
  }
}