using Microsoft.EntityFrameworkCore;
using WMS.Application.DTOs;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly DbContext _context;

        public DashboardService(DbContext context)
        {
            _context = context;
        }

        public async Task<DashboardMetricsDto> GetSummaryMetricsAsync()
        {
            var today = DateTime.UtcNow.Date;

            // 1. Calculate total active corporate headcount
            var totalEmployees = await _context.Set<Employee>()
                .CountAsync(e => e.Status == "Active");

            // 2. Fetch all attendance records logged for today
            var todaysAttendance = await _context.Set<Attendance>()
                .Where(a => a.AttendanceDate == today)
                .ToListAsync();

            var activeTodayCount = todaysAttendance.Count;

            // 3. Compute live operations environment splits
            var wfoCount = todaysAttendance.Count(a => a.WorkMode == "WFO");
            var wfhCount = todaysAttendance.Count(a => a.WorkMode == "WFH" || a.WorkMode == "Hybrid");

            // 4. Compute percentage capacity metrics safely
            double attendanceRate = totalEmployees > 0 
                ? Math.Round(((double)activeTodayCount / totalEmployees) * 100, 1) 
                : 0;

            // 5. Gather outstanding administrative tasks backlog
            var pendingLeaves = await _context.Set<Leave>()
                .CountAsync(l => l.Status == "Pending");

            // 6. Compute total active projects
            var totalProjects = await _context.Set<Project>().CountAsync(p => p.Status == "Active");

            // 7. Return the strongly-typed DTO payload structure
            return new DashboardMetricsDto
            {
                TotalEmployees = totalEmployees,
                ActiveTodayCount = activeTodayCount,
                AttendanceRateToday = attendanceRate,
                PendingLeavesCount = pendingLeaves,
                WfoCount = wfoCount,
                WfhCount = wfhCount,
                TotalProjects = totalProjects
            };
        }
    }
}