using WMS.Domain.Entities;

namespace WMS.Application.Interfaces
{
    public interface ILeaveRepository
    {
        Task<Leave?> GetByIdAsync(int id);
        Task AddAsync(Leave leave);
        Task UpdateAsync(Leave leave);
        Task<IEnumerable<Leave>> GetEmployeeLeavesAsync(int employeeId);
        Task<IEnumerable<Leave>> GetAllLeavesAsync();
    }
}