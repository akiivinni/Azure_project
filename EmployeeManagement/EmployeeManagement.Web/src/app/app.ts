import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import { EmployeeApiService } from './employee-api.service';
import { Employee, EmployeeRequest } from './employee';

@Component({
  imports: [CurrencyPipe, DatePipe, FormsModule, ReactiveFormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly api = inject(EmployeeApiService);
  private readonly formBuilder = inject(FormBuilder);

  employees: Employee[] = [];
  searchTerm = '';
  isLoading = true;
  isSaving = false;
  isDeleting = false;
  isFormOpen = false;
  editingEmployeeId: number | null = null;
  errorMessage = '';
  successMessage = '';

  readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
    department: ['', [Validators.required, Validators.maxLength(100)]],
    jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
    hireDate: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  get filteredEmployees(): Employee[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) return this.employees;
    return this.employees.filter((employee) =>
      [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.department,
        employee.jobTitle,
      ].some((value) => value.toLocaleLowerCase().includes(query)),
    );
  }

  get departmentCount(): number {
    return new Set(this.employees.map((employee) => employee.department)).size;
  }

  get recentCount(): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return this.employees.filter((employee) => new Date(employee.hireDate) >= cutoff).length;
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (employees) => (this.employees = employees),
        error: (error: unknown) => {
          this.errorMessage = this.describeError(error, 'Could not load employees.');
        },
      });
  }

  openCreateForm(): void {
    this.clearNotice();
    this.editingEmployeeId = null;
    this.employeeForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      jobTitle: '',
      hireDate: '',
      salary: 0,
    });
    this.isFormOpen = true;
  }

  openEditForm(employee: Employee): void {
    this.clearNotice();
    this.editingEmployeeId = employee.id;
    this.isSaving = true;
    this.errorMessage = '';
    this.api
      .getById(employee.id)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (record) => {
          this.employeeForm.reset({
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            department: record.department,
            jobTitle: record.jobTitle,
            hireDate: record.hireDate,
            salary: record.salary,
          });
          this.isFormOpen = true;
        },
        error: (error: unknown) => {
          this.errorMessage = this.describeError(error, 'Could not load this employee.');
        },
      });
  }

  closeForm(): void {
    if (this.isSaving) return;
    this.isFormOpen = false;
    this.employeeForm.reset();
  }

  saveEmployee(): void {
    this.clearNotice();
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const request = this.employeeForm.getRawValue() as EmployeeRequest;
    const editingId = this.editingEmployeeId;
    this.isSaving = true;
    const operation: Observable<unknown> = editingId === null
      ? this.api.create(request)
      : this.api.update(editingId, request);

    operation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        this.isFormOpen = false;
        this.successMessage = editingId === null
          ? 'Employee added successfully.'
          : 'Employee changes saved.';
        this.loadEmployees();
      },
      error: (error: unknown) => {
        this.errorMessage = this.describeError(error, 'Could not save this employee.');
      },
    });
  }

  deleteEmployee(employee: Employee): void {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`)) {
      return;
    }
    this.clearNotice();
    this.isDeleting = true;
    this.api
      .delete(employee.id)
      .pipe(finalize(() => (this.isDeleting = false)))
      .subscribe({
        next: () => {
          this.successMessage = `${employee.firstName} ${employee.lastName} was deleted.`;
          this.loadEmployees();
        },
        error: (error: unknown) => {
          this.errorMessage = this.describeError(error, 'Could not delete this employee.');
        },
      });
  }

  trackEmployee(_index: number, employee: Employee): number {
    return employee.id;
  }

  private clearNotice(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private describeError(error: unknown, fallback: string): string {
    const detail = error as { error?: { title?: string; detail?: string; message?: string } };
    return detail?.error?.detail ?? detail?.error?.title ?? detail?.error?.message ?? fallback;
  }
}
