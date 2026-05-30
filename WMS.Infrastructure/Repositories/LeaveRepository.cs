using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;
using WMS.Infrastructure.Data;

namespace WMS.Infrastructure.Repositories
{
    public class LeaveRepository : ILeaveRepository
    {
        private readonly WmsDbContext _context;

        public LeaveRepository(WmsDbContext context)
        {
            _context = context;
        }

        public async Task<Leave?> GetByIdAsync(int id)
        {
            return await _context.Set<Leave>().FindAsync(id);
        }

        public async Task AddAsync(Leave leave)
        {
            await _context.Set<Leave>().AddAsync(leave);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Leave leave)
        {
            _context.Set<Leave>().Update(leave);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Leave>> GetEmployeeLeavesAsync(int employeeId)
        {
            return await _context.Set<Leave>()
                .Where(l => l.EmpId == employeeId)
                .OrderByDescending(l => l.FromDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Leave>> GetAllLeavesAsync()
        {
            return await _context.Set<Leave>()
                .OrderByDescending(l => l.AppliedOn)
                .ToListAsync();
        }
    }
}