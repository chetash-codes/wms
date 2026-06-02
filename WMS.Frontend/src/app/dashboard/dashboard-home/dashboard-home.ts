import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardMetrics, DashboardService } from '../services/dashboard';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  private chartInstance: any;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.extractUserName();
    this.loadMetrics();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
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
        this.renderDistributionChart();
      },
      error: (err) => {
        console.error('Failed to stream aggregate dashboard summary metrics:', err);
        this.loading = false;
      }
    });
  }

  renderDistributionChart(): void {
    const canvas = document.getElementById('workModeChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy(); // Clear old chart on re-renders
    }

    this.chartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Work From Office (WFO)', 'Remote / Hybrid (WFH)'],
        datasets: [{
          data: [this.metrics.wfoCount, this.metrics.wfhCount],
          backgroundColor: [
            '#3f51b5', // Material Primary Blue
            '#ff4081'  // Material Accent Pink
          ],
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { family: 'system-ui, -apple-system, sans-serif', size: 14 }
            }
          }
        }
      }
    });
  }
}
