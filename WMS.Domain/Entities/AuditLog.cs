using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WMS.Domain.Entities
{
    public class AuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AuditId { get; set; }

        [Required]
        public string EntityName { get; set; } = string.Empty; // Maps to NVARCHAR(MAX)

        [Required]
        public int RecordId { get; set; }

        [Required]
        [StringLength(20)]
        public string Action { get; set; } = string.Empty;

        [Required]
        public int CreatedBy { get; set; }

        [ForeignKey("CreatedBy")]
        public Employee? User { get; set; }

        [Required]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
