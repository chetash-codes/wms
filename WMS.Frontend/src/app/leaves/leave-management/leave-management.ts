import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LeaveService, LeaveRequest } from '../services/leave';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.html',
  styleUrls: ['./leave-management.css'],
  standalone: false
})
export class LeaveManagement implements OnInit, OnDestroy {
  displayedColumns: string[] = ['leaveId', 'leaveType', 'duration', 'reason', 'status', 'actions'];
  dataSource: LeaveRequest[] = [];
  private streamSubscription!: Subscription;

  constructor(
    private leaveService: LeaveService, 
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to the shared live data stream
    this.streamSubscription = this.leaveService.leaves$.subscribe((data) => {
      this.dataSource = data;
      this.cdr.detectChanges(); // Repaint table grids instantly when the stream updates
    });

    // 2. Trigger the initial data fetch on page load
    this.leaveService.refreshLeaves();
  }

  ngOnDestroy(): void {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe(); // Clean up memory leaks when navigating away
    }
  }

  onAction(id: number, status: string): void {
    this.leaveService.processLeave(id, status).subscribe({
      next: (msg) => {
        this.snackBar.open(msg, 'Close', { duration: 3000 });
        // No need to manually reload data here! The .pipe(tap()) in the service handles it automatically.
      },
      error: (err) => this.snackBar.open(err.error || 'Action failed.', 'Close', { duration: 3000 })
    });
  }
}