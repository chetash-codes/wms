using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WMS.Application.Services;

namespace WMS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _attendanceService;

        public AttendanceController(AttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpGet("today-status")]
        public async Task<IActionResult> GetTodayStatus()
        {
            // 1. Safely parse the user's Employee ID from their active JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int employeeId))
            {
                return Unauthorized(new { message = "User identity could not be verified from the security token." });
            }

            // 2. Fetch today's structural records from the application layer
            // (Assumes a matching lookup method exists or can query your month-view list for today's date)
            var today = DateTime.UtcNow.Date;
            var history = await _attendanceService.GetMonthViewAsync(employeeId, today.Month, today.Year);

            // Find if there is an active session recorded for today that hasn't checked out yet
            var todayRecord = history.FirstOrDefault(a => a.AttendanceDate.Date == today);

            if (todayRecord != null && todayRecord.CheckOut == null)
            {
                return Ok(new
                {
                    isCheckedIn = true,
                    workMode = todayRecord.WorkMode
                });
            }

            // Return clean baseline state if no active session is found for the calendar date
            return Ok(new
            {
                isCheckedIn = false,
                workMode = (string?)null
            });
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn([FromQuery] string workMode)
        {
            var empId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var success = await _attendanceService.CheckInAsync(empId, workMode);
            return success
                ? Ok(new { message = "Checked in successfully." })
                : BadRequest(new { message = "Already checked in for today." });
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut()
        {
            var empId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var success = await _attendanceService.CheckOutAsync(empId);
            return success
                ? Ok(new { message = "Checked out successfully with hours computed." })
                : BadRequest(new { message = "No active session found or already checked out." });
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMonthlyHistory([FromQuery] int month, [FromQuery] int year)
        {
            // 1. Safely extract the logged-in user's Employee ID from their JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int employeeId))
            {
                return Unauthorized("User identity could not be verified from the security token.");
            }

            // 2. Query the service layer using the validated parameters
            var history = await _attendanceService.GetMonthViewAsync(employeeId, month, year);

            // 3. Return the array data block back to our Angular application
            return Ok(history);
        }
    }
}