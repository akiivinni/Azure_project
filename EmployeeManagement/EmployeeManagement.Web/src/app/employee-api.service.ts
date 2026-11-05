import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeeRequest } from './employee';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/employees';

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.endpoint);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.endpoint}/${id}`);
  }

  create(employee: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.endpoint, employee);
  }

  update(id: number, employee: EmployeeRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
