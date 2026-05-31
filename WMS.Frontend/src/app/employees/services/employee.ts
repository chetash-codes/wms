import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  doj: Date;
  departmentId: number;
  roleId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Requirement: Multi-parameter search routing 
  searchEmployees(name?: string, departmentId?: number, roleId?: number): Observable<Employee[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (departmentId) params = params.set('departmentId', departmentId.toString());
    if (roleId) params = params.set('roleId', roleId.toString());

    return this.http.get<Employee[]>(`${this.apiUrl}/search`, { params });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<string> {
    return this.http.post(this.apiUrl, employee, { responseType: 'text' });
  }

  updateEmployee(id: number, employee: Employee): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, employee, { responseType: 'text' });
  }
}