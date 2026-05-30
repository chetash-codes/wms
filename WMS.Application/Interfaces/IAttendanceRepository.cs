using WMS.Domain.Entities;

namespace WMS.Application.Interfaces
{
    public interface IAttendanceRepository
    {
        Task<Attendance?> GetTodayRecordAsync(int employeeId, DateTime date);
        Task AddAsync(Attendance attendance);
        Task UpdateAsync(Attendance attendance);
        Task<IEnumerable<Attendance>> GetMonthlyHistoryAsync(int employeeId, int month, int year);
    }
}
