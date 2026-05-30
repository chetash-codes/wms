using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.Application.Services
{
    public class AttendanceService
    {
        private readonly IAttendanceRepository _repository;

        public AttendanceService(IAttendanceRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> CheckInAsync(int employeeId, string workMode)
        {
            var today = DateTime.UtcNow.Date;
            var existingRecord = await _repository.GetTodayRecordAsync(employeeId, today);

            if (existingRecord != null) return false; // Already checked in today

            var attendance = new Attendance
            {
                EmpId = employeeId,
                CheckIn = DateTime.UtcNow,
                AttendanceDate = today,
                WorkMode = workMode, // WFO/WFH/Hybrid
            };

            await _repository.AddAsync(attendance);
            return true;
        }

        public async Task<bool> CheckOutAsync(int employeeId)
        {
            var today = DateTime.UtcNow.Date;
            var record = await _repository.GetTodayRecordAsync(employeeId, today);

            if (record == null || record.CheckOut.HasValue) return false; // No session to check out of

            record.CompleteSession(DateTime.UtcNow);

            // Core Requirement: Compute TotalHours on checkout
            await _repository.UpdateAsync(record);
            return true;
        }

        public async Task<IEnumerable<Attendance>> GetMonthViewAsync(int employeeId, int month, int year)
        {
            return await _repository.GetMonthlyHistoryAsync(employeeId, month, year);
        }
    }
}