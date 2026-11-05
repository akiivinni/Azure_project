using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Services;

public interface IEmployeeService
{
    Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken);

    Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<Employee> CreateAsync(EmployeeRequest request, CancellationToken cancellationToken);

    Task<Employee?> UpdateAsync(int id, EmployeeRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
