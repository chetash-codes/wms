import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AttendanceService, AttendanceRecord } from '../services/attendance';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.html',
  styleUrls: ['./attendance-history.css'],
  standalone: false
})
export class AttendanceHistory implements OnInit {
  displayedColumns: string[] = ['attendanceDate', 'workMode', 'checkin', 'checkOut', 'totalHours'];
  dataSource: AttendanceRecord[] = [];
  
  // Interactive bindings initialized to current system date metrics
  selectedMonth: number = new Date().getMonth() + 1; // JS Months are 0-11
  selectedYear: number = new Date().getFullYear();

  months = [
    { value: 1, viewValue: 'January' }, { value: 2, viewValue: 'February' },
    { value: 3, viewValue: 'March' }, { value: 4, viewValue: 'April' },
    { value: 5, viewValue: 'May' }, { value: 6, viewValue: 'June' },
    { value: 7, viewValue: 'July' }, { value: 8, viewValue: 'August' },
    { value: 9, viewValue: 'September' }, { value: 10, viewValue: 'October' },
    { value: 11, viewValue: 'November' }, { value: 12, viewValue: 'December' }
  ];

  years: number[] = [];

  constructor(private attendanceService: AttendanceService, private cdr: ChangeDetectorRef) {
    // Generate a list of select choices from current year going back 3 cycles
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 4; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.attendanceService.getMonthlyHistory(this.selectedMonth, this.selectedYear).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges(); // Repaint grid instantly on selection update
      },
      error: (err) => console.error('Failed to load monthly attendance history logs:', err)
    });
  }
}