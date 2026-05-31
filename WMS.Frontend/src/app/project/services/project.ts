import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  projectId?: number;
  projectName: string;
  status: string;
}

export interface EmployeeProjectAllocation {
  empId: number;
  projectId: number;
  status?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: Project): Observable<string> {
    return this.http.post(`${this.apiUrl}`, project, { responseType: 'text' });
  }

  allocateEmployee(allocation: EmployeeProjectAllocation): Observable<string> {
    return this.http.post(`${this.apiUrl}/allocate`, allocation, { responseType: 'text' });
  }
}