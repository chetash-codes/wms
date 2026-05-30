using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WMS.Domain.Entities
{
    public class Leave
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LeaveId { get; set; }

        [Required]
        public int EmpId { get; set; }

        [ForeignKey("EmpId")]
        public Employee? Employee { get; set; }

        [Required]
        [StringLength(30)]
        public string LeaveType { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Reason { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        public DateTime AppliedOn { get; set; } = DateTime.UtcNow;

        public int? ApprovedBy { get; set; }

        // Self-referencing relationship back to Employee table for the Approver Manager
        [ForeignKey("ApprovedBy")]
        public Employee? Approver { get; set; }

        public DateTime? ApprovedOn { get; set; }
    }
}
