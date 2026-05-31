import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, Project } from '../services/project';
import { EmployeeService, Employee } from '../../employees/services/employee';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-allocation',
  templateUrl: './project-allocation.html',
  styleUrls: ['./project-allocation.css'],
  standalone: false
})
export class ProjectAllocation implements OnInit {
  allocationForm!: FormGroup;
  projectForm!: FormGroup;
  projects: Project[] = [];
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadDropdownData();
  }

  initForms(): void {
    this.allocationForm = this.fb.group({
      empId: ['', [Validators.required]],
      projectId: ['', [Validators.required]]
    });

    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['Active', [Validators.required]]
    });
  }

  loadDropdownData(): void {
    // Wrap in a setTimeout block to schedule data arrival right after the component's 
    // baseline rendering pass finishes, avoiding layout expression conflicts
    setTimeout(() => {
      this.projectService.getProjects().subscribe({
        next: (projData) => {
          this.projects = projData;
          this.cdr.detectChanges();
        }
      });

      this.employeeService.searchEmployees('').subscribe({
        next: (empData) => {
          this.employees = empData;
          this.cdr.detectChanges();
        }
      });
    });
  }

  onCreateProject(): void {
    if (this.projectForm.invalid) return;

    this.projectService.createProject(this.projectForm.value).subscribe({
      next: (msg) => {
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        this.projectForm.reset({ status: 'Active' });
        this.loadDropdownData();
      },
      error: (err) => this.snackBar.open(err.error || 'Failed to create project.', 'Close', { duration: 3000 })
    });
  }

  onAllocate(): void {
    if (this.allocationForm.invalid) return;

    const payload = {
      ...this.allocationForm.value,
      createdBy: 'System'
    };

    this.projectService.allocateEmployee(payload).subscribe({
      next: (msg) => {
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        this.allocationForm.reset();
      },
      error: (err) => this.snackBar.open(err.error || 'Allocation failed.', 'Close', { duration: 3000 })
    });
  }
}