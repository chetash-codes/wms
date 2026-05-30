using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.Application.Services
{
    public class LeaveService
    {
        private readonly ILeaveRepository _repository;

        public LeaveService(ILeaveRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> SubmitRequestAsync(Leave leaveRequest)
        {
            if (leaveRequest.FromDate < DateTime.Today)
            {
                throw new ArgumentException("Leave start date cannot be in the past.");
            }
            if (leaveRequest.ToDate < leaveRequest.FromDate)
            {
                throw new ArgumentException("End date cannot precede the start date.");
            }

            leaveRequest.Status = "Pending"; // Initial fallback constraint
            leaveRequest.AppliedOn = DateTime.UtcNow;

            await _repository.AddAsync(leaveRequest);
            return true;
        }

        public async Task ProcessApprovalAsync(int leaveId, int managerId, string targetStatus)
        {
            var leave = await _repository.GetByIdAsync(leaveId);
            if (leave == null) throw new KeyNotFoundException("Leave application entry not found.");

            if (leave.Status != "Pending")
            {
                throw new InvalidOperationException("This application has already been processed.");
            }

            if (targetStatus != "Approved" && targetStatus != "Rejected")
            {
                throw new ArgumentException("Invalid state transition specified.");
            }

            leave.Status = targetStatus;
            leave.ApprovedBy = managerId;
            leave.ApprovedOn = DateTime.UtcNow;

            await _repository.UpdateAsync(leave);
        }

        public async Task<IEnumerable<Leave>> GetEmployeeLeavesAsync(int employeeId)
        {
            return await _repository.GetEmployeeLeavesAsync(employeeId);
        }

        public async Task<IEnumerable<Leave>> GetAllLeavesAsync()
        {
            return await _repository.GetAllLeavesAsync();
        }
    }
}