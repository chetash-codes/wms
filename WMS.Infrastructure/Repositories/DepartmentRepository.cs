using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;
using WMS.Infrastructure.Data;

namespace WMS.Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly WmsDbContext _context;

        public DepartmentRepository(WmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _context.Set<Department>()
                .OrderBy(d => d.DepartmentName)
                .ToListAsync();
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            return await _context.Set<Department>().FindAsync(id);
        }

        public async Task AddAsync(Department department)
        {
            department.CreatedOn = DateTime.UtcNow; // Explicit baseline safety tracking
            await _context.Set<Department>().AddAsync(department);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var dept = await _context.Set<Department>().FindAsync(id);
            if (dept != null)
            {
                _context.Set<Department>().Remove(dept);
                await _context.SaveChangesAsync();
            }
        }
    }
}