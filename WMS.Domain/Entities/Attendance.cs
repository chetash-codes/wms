using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WMS.Domain.Entities
{
    public class Attendance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceId { get; set; }

        [Required]
        public int EmpId { get; set; }

        [ForeignKey("EmpId")]
        public Employee? Employee { get; set; }

        [Required]
        public DateTime CheckIn { get; set; }

        public DateTime? CheckOut { get; set; }

        // Handled via SQL computed column or business logic calculation
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public double? TotalHours { get; private set; }

        [StringLength(20)]
        public string? WorkMode { get; set; }

        [Required]
        public DateTime AttendanceDate { get; set; }

        public void CompleteSession(DateTime checkOutTime)
        {
            CheckOut = checkOutTime;
            TimeSpan duration = checkOutTime - CheckIn;
            TotalHours = (float)Math.Round(duration.TotalHours, 2);
        }
    }
}
