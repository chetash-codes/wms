using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;

namespace WMS.Infrastructure.Data
{
    public class WmsDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;
        public WmsDbContext(DbContextOptions<WmsDbContext> options, ICurrentUserService currentUserService) : base(options) {
            _currentUserService = currentUserService;
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<EmployeeProjectAllocation> EmployeeProjectAllocations { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Enforce Unique constraints required by specification
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            // Prevent multiple cascade delete paths
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany()
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict); // Prevents cycles

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Restrict); // Prevents cycles

            // Explicitly configure EF Core to push C# values down to this column
            modelBuilder.Entity<Attendance>()
                .Property(a => a.TotalHours)
                .HasColumnType("float") // Matches standard SQL float specs
                .ValueGeneratedNever(); // Forces EF Core NOT to expect a database side calculation

            // Data Seeding for system Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin", Description = "System Administrator" },
                new Role { RoleId = 2, RoleName = "Manager", Description = "Department Manager" },
                new Role { RoleId = 3, RoleName = "Employee", Description = "Standard User Staff" }
            );
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
                .ToList();

            var auditLogs = new List<AuditLog>();

            foreach (var entry in entries)
            {
                // Prevent infinite loop logging the audit logs table itself
                if (entry.Entity is AuditLog) continue;

                var log = new AuditLog
                {
                    EntityName = entry.Entity.GetType().Name,
                    Action = entry.State.ToString(), // Insert, Update, or Delete
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = _currentUserService.UserId ?? 1 // Placeholder: In production, parse via an ICurrentUserService provider
                };

                // Track the record primary identity key post-save if available
                auditLogs.Add(log);
            }

            if (auditLogs.Any())
            {
                await Set<AuditLog>().AddRangeAsync(auditLogs, cancellationToken);
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
