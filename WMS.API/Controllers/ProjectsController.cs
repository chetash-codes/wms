using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectRepository _repo;

        public ProjectsController(IProjectRepository repo)
        {
            _repo = repo;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("clients")]
        public async Task<IActionResult> CreateClient([FromBody] Client client)
        {
            await _repo.AddClientAsync(client);
            return Ok("Client registered successfully.");
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project project)
        {
            await _repo.AddProjectAsync(project);
            return Ok("Project created successfully.");
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("allocate")]
        public async Task<IActionResult> AllocateEmployee([FromBody] EmployeeProjectAllocation allocation)
        {
            var creatorId = User.FindFirst(ClaimTypes.Name)?.Value ?? "System";
            allocation.CreatedBy = creatorId; // Track assignment metadata

            await _repo.AllocateEmployeeAsync(allocation);
            return Ok("Employee successfully allocated to the project.");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _repo.GetAllProjectsAsync();
            return Ok(projects);
        }
    }
}