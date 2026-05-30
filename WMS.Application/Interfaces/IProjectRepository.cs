using WMS.Domain.Entities;

namespace WMS.Application.Interfaces
{
    public interface IProjectRepository
    {
        Task AddClientAsync(Client client);
        Task AddProjectAsync(Project project);
        Task AllocateEmployeeAsync(EmployeeProjectAllocation allocation);
        Task<IEnumerable<Project>> GetProjectsByEmployeeAsync(int employeeId);
        Task<IEnumerable<Project>> GetAllProjectsAsync();
    }
}
