using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace WMS.Infrastructure.Data;

public class WmsDbContextFactory : IDesignTimeDbContextFactory<WmsDbContext>
{
    public WmsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<WmsDbContext>();

        // This connection string is ONLY used by the migration tool at design time
        optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=WmsDB;Trusted_Connection=True;TrustServerCertificate=True;");

        return new WmsDbContext(optionsBuilder.Options);
    }
}