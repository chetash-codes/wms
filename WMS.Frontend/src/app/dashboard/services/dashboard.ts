import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardMetrics {
  totalEmployees: number;
  activeTodayCount: number;
  attendanceRateToday: number;
  pendingLeavesCount: number;
  wfoCount: number;
  wfhCount: number;
  totalProjects: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard/metrics`;

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(this.apiUrl);
  }
}