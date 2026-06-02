import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css'],
  standalone: false
})
export class EmployeeForm implements OnInit {
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  isAdmin: boolean = false;

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' }
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<EmployeeForm>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  ngOnInit(): void {
    // Determine if data was provided to the dialog modal frame
    this.isEditMode = !!this.editData;
    this.isAdmin = this.authService.isAdmin();

    this.initForm();

    // If in Edit Mode, pre-populate all form input blocks with existing values
    if (this.isEditMode) {
      this.employeeForm.patchValue(this.editData);

      // Handle formatting date strings smoothly if your backend saves complex objects
      if (this.editData.dob) {
        this.employeeForm.patchValue({ dob: new Date(this.editData.dob) });
      }
    }
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      gender: ['M', [Validators.required]],
      dob: ['', [Validators.required]],
      doj: [new Date(), [Validators.required]],
      departmentId: [1, [Validators.required]],
      roleId: [{ value: 3, disabled: !this.isAdmin }, [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  onSave(): void {
    if (this.employeeForm.invalid) return;

    const formData = this.employeeForm.getRawValue();

    if (this.isEditMode) {
      // ROUTE A: Update Execution Path
      this.employeeService.updateEmployee(this.editData.employeeId, formData).subscribe({
        next: (successMsg) => {
          this.snackBar.open(successMsg, 'Close', { duration: 3000 });
          this.dialogRef.close('saved');
        },
        error: (err) => this.snackBar.open(err.error || 'Failed to update employee.', 'Close', { duration: 3000 })
      });
    } else {
      // ROUTE B: Create Execution Path
      this.employeeService.createEmployee(formData).subscribe({
        next: (successMsg) => {
          this.snackBar.open(successMsg, 'Close', { duration: 3000 });
          this.dialogRef.close('saved');
        },
        error: (err) => this.snackBar.open(err.error || 'Failed to register employee.', 'Close', { duration: 3000 })
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}