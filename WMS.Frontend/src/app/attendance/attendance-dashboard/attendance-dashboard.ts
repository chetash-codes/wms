import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { AttendanceService } from '../services/attendance';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-attendance-dashboard',
  templateUrl: './attendance-dashboard.html',
  styleUrls: ['./attendance-dashboard.css'],
  standalone: false
})
export class AttendanceDashboard implements OnInit, OnDestroy {
  selectedWorkMode: string = 'WFO';
  isCheckedIn: boolean = false;
  currentTime: Date = new Date();
  private clockIntervalId: any;

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef, // Inject Change Detector
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    // Keep clock updated in real-time smoothly
    this.clockIntervalId = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.detectChanges(); // Force UI engine to repaint the clock digits safely
    }, 1000);

    // Initial state check from memory shell
    this.isCheckedIn = localStorage.getItem('wms_is_checked_in') === 'true';
    const savedMode = localStorage.getItem('wms_selected_mode');
    if (savedMode) {
      this.selectedWorkMode = savedMode;
    }

    // Absolute Source of Truth: Sync live with database records
    this.attendanceService.getTodayStatus().subscribe({
      next: (status) => {
        this.isCheckedIn = status.isCheckedIn;
        if (status.isCheckedIn && status.workMode) {
          this.selectedWorkMode = status.workMode;
          localStorage.setItem('wms_is_checked_in', 'true');
          localStorage.setItem('wms_selected_mode', status.workMode);
        } else {
          // If the database says they aren't checked in today, clear stale cache!
          this.isCheckedIn = false;
          localStorage.removeItem('wms_is_checked_in');
          localStorage.removeItem('wms_selected_mode');
        }
        this.cdr.detectChanges(); // Repaint the control cards securely
      },
      error: (err) => {
        console.error('Could not sync real-time database attendance status:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId); // Prevent background memory leaks
    }
  }

  onCheckIn(): void {
    this.attendanceService.checkIn(this.selectedWorkMode).subscribe({
      next: (res) => {
        this.isCheckedIn = true;
        localStorage.setItem('wms_is_checked_in', 'true');
        localStorage.setItem('wms_selected_mode', this.selectedWorkMode); // Remember selection layout
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
        this.cdr.detectChanges(); // Update color card status immediately
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Check-in failed.';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
      }
    });
  }

  onCheckOut(): void {
    this.attendanceService.checkOut().subscribe({
      next: (res) => {
        this.isCheckedIn = false;
        localStorage.removeItem('wms_is_checked_in');
        localStorage.removeItem('wms_selected_mode');
        this.snackBar.open(res.message, 'Close', { duration: 3000 });
        this.cdr.detectChanges(); // Reset layout state instantly
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Check-out failed.';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
      }
    });
  }
}