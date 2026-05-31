import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Department {
  departmentId?: number;
  departmentName: string;
  description?: string;
  createdOn?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/department`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  createDepartment(department: Department): Observable<any> {
    return this.http.post<any>(this.apiUrl, department);
  }
}