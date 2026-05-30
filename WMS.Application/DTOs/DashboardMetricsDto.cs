namespace WMS.Application.DTOs
{
    public class DashboardMetricsDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveTodayCount { get; set; }
        public double AttendanceRateToday { get; set; }
        public int PendingLeavesCount { get; set; }
        public int WfoCount { get; set; }
        public int WfhCount { get; set; }
        public int TotalProjects {  get; set; }
    }
}
