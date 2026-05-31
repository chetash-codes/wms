import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveRequest {
  leaveId?: number;
  empId: number;
  leaveType: string; // Sick, Casual, Earned
  fromDate: string;
  toDate: string;
  reason?: string;
  status?: string; // Pending, Approved, Rejected
  appliedOn?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leaves`;

  // Create the internal reactive data stream container
  private leavesSubject = new BehaviorSubject<LeaveRequest[]>([]);
  // Expose this stream publicly as an observable that components can listen to
  leaves$ = this.leavesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 3. Centralized method to fetch data and broadcast it to all listeners
  refreshLeaves(): void {
    this.http.get<LeaveRequest[]>(this.apiUrl).subscribe({
      next: (data) => this.leavesSubject.next(data),
      error: (err) => console.error('Failed to update leave cache:', err)
    });
  }

  applyForLeave(leave: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, leave, { responseType: 'text' }).pipe(
      // 4. Tap into a successful submission and trigger an immediate data refresh
      tap(() => this.refreshLeaves())
    );
  }

  // Get all leaves (Managers use this to see everyone's entries)
  // Adjust endpoint string if you choose to filter by manager or status later
  getEmployeeLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.apiUrl); 
  }

  processLeave(id: number, status: string): Observable<any> {
    // Passes target status (Approved/Rejected) as a query parameter matching our controller spec
    return this.http.post(`${this.apiUrl}/${id}/process?status=${status}`, {}, { responseType: 'text' }).pipe(
      // 5. Tap into a successful approval/rejection and refresh the data stream instantly
      tap(() => this.refreshLeaves())
    );
  }
}