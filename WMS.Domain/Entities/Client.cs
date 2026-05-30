using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WMS.Domain.Entities
{
    public class Client
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ClientId { get; set; }

        [Required]
        [StringLength(100)]
        public string ClientName { get; set; } = string.Empty;

        public string? ClientAdress { get; set; } // Maps to VARCHAR(MAX)

        [Column(TypeName = "numeric(10,0)")]
        public decimal? ClientPhoneNumber { get; set; }

        [StringLength(20)]
        public string? ClientLocation { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active";
    }
}
