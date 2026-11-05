using EmployeeManagement.API.Models;
using EmployeeManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController(IEmployeeService employeeService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<Employee>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<Employee>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await employeeService.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Employee>> GetById(int id, CancellationToken cancellationToken)
    {
        var employee = await employeeService.GetByIdAsync(id, cancellationToken);
        return employee is null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Employee>> Create(
        EmployeeRequest request,
        CancellationToken cancellationToken)
    {
        var employee = await employeeService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(
        int id,
        EmployeeRequest request,
        CancellationToken cancellationToken)
    {
        var employee = await employeeService.UpdateAsync(id, request, cancellationToken);
        return employee is null ? NotFound() : NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await employeeService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
