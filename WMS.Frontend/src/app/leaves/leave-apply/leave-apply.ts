import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService, LeaveRequest } from '../services/leave';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-apply',
  templateUrl: './leave-apply.html',
  styleUrls: ['./leave-apply.css'],
  standalone: false
})
export class LeaveApply implements OnInit {
  leaveForm!: FormGroup;
  isManagerOrAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkUserRole();
  }

  initForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['Sick', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      reason: ['', [Validators.maxLength(500)]]
    });
  }

  checkUserRole(): void {
  const token = localStorage.getItem('wms_auth_token');
  if (token) {
    try {
      // Decode the payload section of the token
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('--- JWT PAYLOAD WINDOW ---', payload); // Helpful console log to see exact keys

      // Extract the role using either the long URI format or the short modern text key
      const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      console.log('Extracted User Role:', role);

      // Verify if the role matches our administrative criteria
      this.isManagerOrAdmin = role === 'Admin' || role === 'Manager';
    } catch (e) {
      console.error('Error decoding authentication token:', e);
      this.isManagerOrAdmin = false;
    }
  }
}

  onSubmit(): void {
    if (this.leaveForm.invalid) return;

    // Format Javascript date objects cleanly to ISO strings before transmitting
    const formData: LeaveRequest = {
      empId: 0, // Handled automatically on the backend via token claims
      leaveType: this.leaveForm.value.leaveType,
      fromDate: this.leaveForm.value.fromDate.toISOString().split('T')[0],
      toDate: this.leaveForm.value.toDate.toISOString().split('T')[0],
      reason: this.leaveForm.value.reason
    };

    this.leaveService.applyForLeave(formData).subscribe({
      next: (msg) => {
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        this.leaveForm.reset({ leaveType: 'Sick' });
      },
      error: (err) => {
        this.snackBar.open(err.error || 'Failed to submit leave request.', 'Close', { duration: 3000 });
      }
    });
  }
}