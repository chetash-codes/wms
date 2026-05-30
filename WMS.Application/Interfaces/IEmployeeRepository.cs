using WMS.Domain.Entities;

namespace WMS.Application.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task<IEnumerable<Employee>> SearchAsync(string? name, int? departmentId, int? roleId);
        Task AddWithLoginAsync(Employee employee, string plainTextPassword);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(int id);
    }
}
