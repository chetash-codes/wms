import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardMetrics, DashboardService } from '../services/dashboard';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
  standalone: false
})
export class DashboardHome implements OnInit {
  metrics: DashboardMetrics = {
    totalEmployees: 0,
    activeTodayCount: 0,
    attendanceRateToday: 0,
    pendingLeavesCount: 0,
    wfoCount: 0,
    wfhCount: 0,
    totalProjects: 0
  };
  
  loading: boolean = true;
  userName: string = 'User';

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.extractUserName();
    this.loadMetrics();
  }

  extractUserName(): void {
    const token = localStorage.getItem('wms_auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Grabs user profile handle or displays placeholder name string fallback
        this.userName = payload['unique_name'] || payload['sub'] || 'Manager';
      } catch (e) {
        console.error('Failed to parse identity metrics from token payload:', e);
      }
    }
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
        this.cdr.detectChanges(); // Repaint analytical cards grid elements immediately
      },
      error: (err) => {
        console.error('Failed to stream aggregate dashboard summary metrics:', err);
        this.loading = false;
      }
    });
  }
}
