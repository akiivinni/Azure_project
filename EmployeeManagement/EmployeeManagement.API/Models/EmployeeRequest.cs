using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models;

public class EmployeeRequest
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    public DateOnly? HireDate { get; set; }

    [Range(typeof(decimal), "0", "9999999999999999")]
    public decimal Salary { get; set; }
}
