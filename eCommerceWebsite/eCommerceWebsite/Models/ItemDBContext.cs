using Microsoft.EntityFrameworkCore;

namespace eCommerceWebsite.Models
{
    public class ItemDBContext : DbContext
    {
        public ItemDBContext(DbContextOptions<ItemDBContext> options) : base(options)
        {
        }
        public DbSet<Items> Items { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=LiamWaters\\SQLEXPRESS;Database=Ecommerce;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;");

        }
    }
}