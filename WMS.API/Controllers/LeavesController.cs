using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WMS.Application.Services;
using WMS.Domain.Entities;

namespace WMS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LeavesController : ControllerBase
    {
        private readonly LeaveService _leaveService;

        public LeavesController(LeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] Leave leave)
        {
            try
            {
                leave.EmpId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                await _leaveService.SubmitRequestAsync(leave);
                return Ok("Leave application submitted successfully.");
            }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
        }

        [Authorize(Roles = "Admin,Manager")] // Only managers or admins can process states
        [HttpPost("{id}/process")]
        public async Task<IActionResult> Process(int id, [FromQuery] string status)
        {
            try
            {
                var managerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                await _leaveService.ProcessApprovalAsync(id, managerId, status);
                return Ok($"Application status updated to {status}.");
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeaves()
        {
            // 1. Extract identity and role claims from the user's validated token
            var empId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var isManagerOrAdmin = User.IsInRole("Admin") || User.IsInRole("Manager");

            // 2. Dynamic Routing Logic based on User Permissions
            if (isManagerOrAdmin)
            {
                // Option B: Managers and Admins pull the entire table for review
                var allLeaves = await _leaveService.GetAllLeavesAsync();
                return Ok(allLeaves);
            }
            else
            {
                // Option A: Standard employees only pull records matching their own ID
                var personalLeaves = await _leaveService.GetEmployeeLeavesAsync(empId);
                return Ok(personalLeaves);
            }
        }
    }
}