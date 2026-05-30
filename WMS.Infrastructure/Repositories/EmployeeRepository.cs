using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces;
using WMS.Domain.Entities;
using WMS.Infrastructure.Data;

namespace WMS.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly WmsDbContext _context;

        public EmployeeRepository(WmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees.Include(e => e.Department).Include(e => e.Role).ToListAsync();
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees.Include(e => e.Department).Include(e => e.Role)
                .FirstOrDefaultAsync(e => e.EmployeeId == id);
        }

        public async Task<IEnumerable<Employee>> SearchAsync(string? name, int? departmentId, int? roleId)
        {
            var query = _context.Employees.Include(e => e.Department).Include(e => e.Role).AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(e => e.FirstName.Contains(name) || e.LastName.Contains(name));
            }
            if (departmentId.HasValue)
            {
                query = query.Where(e => e.DepartmentId == departmentId.Value);
            }
            if (roleId.HasValue)
            {
                query = query.Where(e => e.RoleId == roleId.Value);
            }

            return await query.ToListAsync();
        }

        public async Task AddWithLoginAsync(Employee employee, string plainTextPassword)
        {
            // Open an explicit transaction boundary over the DbContext execution pipeline
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Insert the Employee profile first so SQL Server computes the Identity EmployeeId
                await _context.Set<Employee>().AddAsync(employee);
                await _context.SaveChangesAsync();

                // 2. Hash the plain text password into a secure string format
                // Replace BCrypt.Net.BCrypt.HashPassword with your project's specific string hashing method if different
                string securePasswordHash = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);

                // 3. Construct the UserLogin entity matching your model properties exactly
                var newLogin = new UserLogin
                {
                    Username = employee.Email,            // Defaults username to corporate email
                    PasswordHash = securePasswordHash,    // Saved cleanly into the VARCHAR(MAX) string column
                    EmployeeId = employee.EmployeeId,      // Maps to your model's exact FK property
                    RoleId = employee.RoleId,              // Inherits the Role clearance mapped on the form
                    LastLogin = null
                };

                // 4. Save the login record inside the same transaction scope
                await _context.Set<UserLogin>().AddAsync(newLogin);
                await _context.SaveChangesAsync();

                // 5. If both operations succeed without exception, permanently commit to SQL Server
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                // If any error occurs (e.g. duplicate email constraint violation), roll back everything completely
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
            }
        }
    }
}
