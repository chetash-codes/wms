using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;
using WMS.Infrastructure.Data;

namespace WMS.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly WmsDbContext _context;

        public ProjectRepository(WmsDbContext context)
        {
            _context = context;
        }

        public async Task AddClientAsync(Client client)
        {
            await _context.Set<Client>().AddAsync(client);
            await _context.SaveChangesAsync();
        }

        public async Task AddProjectAsync(Project project)
        {
            await _context.Set<Project>().AddAsync(project);
            await _context.SaveChangesAsync();
        }

        public async Task AllocateEmployeeAsync(EmployeeProjectAllocation allocation)
        {
            // Set required baseline creation metadata fields matching schema specs
            allocation.AssignedOn = DateTime.UtcNow;
            allocation.CreateDate = DateTime.UtcNow;

            await _context.Set<EmployeeProjectAllocation>().AddAsync(allocation);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectsByEmployeeAsync(int employeeId)
        {
            return await _context.Set<EmployeeProjectAllocation>()
                .Where(a => a.EmpId == employeeId && a.Status == true) // Active allocations only
                .Select(a => a.Project!)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return await _context.Set<Project>()
                .Where(p => p.Status == "Active")
                .OrderBy(p => p.ProjectName)
                .ToListAsync();
        }
    }
}