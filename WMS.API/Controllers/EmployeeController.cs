using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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