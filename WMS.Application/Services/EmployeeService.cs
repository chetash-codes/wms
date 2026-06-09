using WMS.Application.DTOs;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.Application.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Employee>> SearchEmployeesAsync(string? name, int? deptId, int? roleId)
        {
            return await _repository.SearchAsync(name, deptId, roleId);
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<bool> CreateEmployeeAsync(EmployeeDto dto)
        {
            // Business Rule Validation: Employee must be >= 18 years old
            if (dto.DOB > DateTime.Today.AddYears(-18))
            {
                throw new ArgumentException("Employee must be at least 18 years old.");
            }

            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                DOB = dto.DOB,
                DOJ = dto.DOJ,
                DepartmentId = dto.DepartmentId,
                RoleId = dto.RoleId,
                Status = dto.Status
            };

            string defaultTemporaryPassword = dto.RoleId switch
            {
                1 => "WelcomeAdmin@123",
                2 => "WelcomeManager@123",
                3 => "WelcomeEmployee@123",
                _ => "WelcomeEmployee@123" // Safe fallback default string
            };

            await _repository.AddWithLoginAsync(employee, defaultTemporaryPassword);
            return true;
        }

        public async Task UpdateEmployeeAsync(int id, EmployeeDto dto)
        {
            var existing = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Employee not found");

            if (dto.DOB > DateTime.Today.AddYears(-18))
            {
                throw new ArgumentException("Employee must be at least 18 years old.");
            }

            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.Email = dto.Email;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.Gender = dto.Gender;
            existing.DepartmentId = dto.DepartmentId;
            existing.RoleId = dto.RoleId;
            existing.Status = dto.Status;
            existing.UpdatedOn = DateTime.UtcNow;

            await _repository.UpdateAsync(existing);
        }
    }
}