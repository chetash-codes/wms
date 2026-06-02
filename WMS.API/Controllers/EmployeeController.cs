using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WMS.Application.DTOs;
using WMS.Application.Services;

namespace WMS.API.Controllers
{
    [Authorize] // Secure this entire controller with JWT
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? name, [FromQuery] int? departmentId, [FromQuery] int? roleId)
        {
            var results = await _employeeService.SearchEmployeesAsync(name, departmentId, roleId);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeDto dto)
        {
            try
            {
                // 2. Identify who is making the request from their JWT token
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // 3. Prevent Privilege Escalation: 
                // If a Manager bypasses the frontend and tries to create an Admin (1) or Manager (2), block them.
                if (currentUserRole == "Manager" && dto.RoleId < 3)
                {
                    return StatusCode(403, "Forbidden: Managers are only authorized to provision standard Employee profiles.");
                }

                // If a Manager creates an employee, strictly force the RoleId to 3 just to be safe
                if (currentUserRole == "Manager")
                {
                    dto.RoleId = 3;
                }

                await _employeeService.CreateEmployeeAsync(dto);
                return StatusCode(211, "Employee profile created successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeDto dto)
        {
            try
            {
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                // 1. Fetch the target employee BEFORE allowing any modifications
                var targetEmployee = await _employeeService.GetEmployeeByIdAsync(id);
                if (targetEmployee == null)
                {
                    return NotFound(new { message = "Employee not found." });
                }

                // 2. Strict Role Enforcement for Managers
                if (currentUserRole == "Manager")
                {
                    // CRITICAL FIX: Managers cannot target existing Admins (1) or other Managers (2)
                    if (targetEmployee.RoleId < 3)
                    {
                        return StatusCode(403, new { message = "Forbidden: Managers cannot modify executive or peer profiles." });
                    }

                    // Prevent assigning higher roles during the edit
                    if (dto.RoleId < 3)
                    {
                        return StatusCode(403, new { message = "Forbidden: You cannot elevate an employee's clearance." });
                    }

                    // Absolute safety fallback
                    dto.RoleId = 3;
                }

                // 3. Admins bypass the above blocks and execute the update directly
                await _employeeService.UpdateEmployeeAsync(id, dto);
                return Ok("Employee profile updated successfully.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}