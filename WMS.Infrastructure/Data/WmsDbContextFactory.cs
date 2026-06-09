using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using WMS.Application.Interfaces;

namespace WMS.Infrastructure.Data;

public class WmsDbContextFactory : IDesignTimeDbContextFactory<WmsDbContext>
{
    public WmsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<WmsDbContext>();

        // This connection string is ONLY used by the migration tool at design time
        optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=WmsDB;Trusted_Connection=True;TrustServerCertificate=True;");

        var designTimeUserService = new DesignTimeCurrentUserService();

        return new WmsDbContext(optionsBuilder.Options, designTimeUserService);
    }
}

public class DesignTimeCurrentUserService : ICurrentUserService
{
    public int? UserId => null;
    public string? Role => "Employee";
}