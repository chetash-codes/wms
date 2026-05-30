namespace WMS.Application.DTOs
{
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public DateTime DOJ { get; set; }
        public int DepartmentId { get; set; }
        public int RoleId { get; set; }
        public string Status { get; set; } = "Active";
    }
}
