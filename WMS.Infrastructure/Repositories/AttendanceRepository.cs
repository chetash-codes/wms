using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;
using WMS.Infrastructure.Data;

namespace WMS.Infrastructure.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly WmsDbContext _context;

        public AttendanceRepository(WmsDbContext context)
        {
            _context = context;
        }

        public async Task<Attendance?> GetTodayRecordAsync(int employeeId, DateTime date)
        {
            return await _context.Set<Attendance>()
                .FirstOrDefaultAsync(a => a.EmpId == employeeId && a.AttendanceDate == date.Date);
        }

        public async Task AddAsync(Attendance attendance)
        {
            await _context.Set<Attendance>().AddAsync(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Attendance attendance)
        {
            _context.Set<Attendance>().Update(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Attendance>> GetMonthlyHistoryAsync(int employeeId, int month, int year)
        {
            return await _context.Set<Attendance>()
                .Where(a => a.EmpId == employeeId && a.AttendanceDate.Month == month && a.AttendanceDate.Year == year)
                .OrderByDescending(a => a.AttendanceDate)
                .ToListAsync();
        }
    }
}