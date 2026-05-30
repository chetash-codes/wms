using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WMS.Domain.Entities
{
    public class EmployeeProjectAllocation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AllocationId { get; set; }

        [Required]
        public int EmpId { get; set; }

        [ForeignKey("EmpId")]
        public Employee? Employee { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        [Required]
        public DateTime AssignedOn { get; set; }

        [Required]
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string CreatedBy { get; set; } = string.Empty;

        public bool Status { get; set; } = true; // Maps to BIT Default (Active/1)

        [StringLength(50)]
        public string? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
