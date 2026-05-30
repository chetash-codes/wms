using WMS.Domain.Entities;

namespace WMS.Application.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task AddAsync(Department department);
        Task DeleteAsync(int id);
    }
}
