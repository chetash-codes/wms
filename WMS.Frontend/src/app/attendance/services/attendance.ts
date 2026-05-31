import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceRecord {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) { }

  checkIn(workMode: string): Observable<AttendanceRecord> {
    // Passes workMode as a query parameter matching our .NET controller spec
    return this.http.post<AttendanceRecord>(`${this.apiUrl}/checkin`, null, {
      params: new HttpParams().set('workMode', workMode)
    });
  }

  checkOut(): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(`${this.apiUrl}/checkout`, null);
  }

  getTodayStatus(): Observable<{ isCheckedIn: boolean, workMode?: string }> {
    return this.http.get<{ isCheckedIn: boolean, workMode?: string }>(`${this.apiUrl}/today-status`);
  }

  getMonthlyHistory(month: number, year: number): Observable<AttendanceRecord[]> {
    // Pass month and year parameters to match your backend query specification
    return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/history?month=${month}&year=${year}`);
  }
}