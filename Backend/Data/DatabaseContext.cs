using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace NetCoreAPISqlLite.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<Information> Information { get; set; }
        public DbSet<InformationType> InformationType { get; set; }
        public DbSet<Picture> Picture { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Defining the relationship
            // modelBuilder.Entity<Information>()
            //     .HasOne(p => p.InformationType)
            //     .WithMany(c => c.Informations)
            //     .HasForeignKey(p => p.Type_ID);

            // modelBuilder.Entity<Picture>()
            //     .HasOne(p => p.Information)
            //     .WithMany(c => c.Pictures)
            //     .HasForeignKey(p => p.Information_ID);
        }
    }
}