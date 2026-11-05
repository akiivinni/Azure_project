using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Services;

public class EmployeeService(AppDbContext dbContext) : IEmployeeService
{
    public async Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Employees
            .AsNoTracking()
            .OrderBy(employee => employee.Id)
            .ToListAsync(cancellationToken);
    }

    public Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return dbContext.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(employee => employee.Id == id, cancellationToken);
    }

    public async Task<Employee> CreateAsync(EmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = new Employee();
        UpdateEmployee(employee, request);

        dbContext.Employees.Add(employee);
        await dbContext.SaveChangesAsync(cancellationToken);

        return employee;
    }

    public async Task<Employee?> UpdateAsync(
        int id,
        EmployeeRequest request,
        CancellationToken cancellationToken)
    {
        var employee = await dbContext.Employees
            .FirstOrDefaultAsync(employee => employee.Id == id, cancellationToken);

        if (employee is null)
        {
            return null;
        }

        UpdateEmployee(employee, request);
        await dbContext.SaveChangesAsync(cancellationToken);

        return employee;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var employee = await dbContext.Employees
            .FirstOrDefaultAsync(employee => employee.Id == id, cancellationToken);

        if (employee is null)
        {
            return false;
        }

        dbContext.Employees.Remove(employee);
        await dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static void UpdateEmployee(Employee employee, EmployeeRequest request)
    {
        employee.FirstName = request.FirstName;
        employee.LastName = request.LastName;
        employee.Email = request.Email;
        employee.Department = request.Department;
        employee.JobTitle = request.JobTitle;
        employee.HireDate = request.HireDate!.Value;
        employee.Salary = request.Salary;
    }
}
