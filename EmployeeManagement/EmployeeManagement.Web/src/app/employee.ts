export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  salary: number;
}

export type EmployeeRequest = Omit<Employee, 'id'>;
