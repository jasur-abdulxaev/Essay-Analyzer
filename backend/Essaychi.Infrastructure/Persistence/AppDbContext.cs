using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Essaychi.Application.Interfaces;
using Essaychi.Domain.Entities;
using System.Collections.Generic;

namespace Essaychi.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Essay> Essays { get; set; }
        public DbSet<AnalysisResult> AnalysisResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ClerkUserId).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
                entity.HasMany(e => e.Essays)
                      .WithOne(e => e.User)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Essay>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.HasOne(e => e.AnalysisResult)
                      .WithOne(a => a.Essay)
                      .HasForeignKey<AnalysisResult>(a => a.EssayId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AnalysisResult>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                // Store GrammarErrors as JSON in the database
                entity.Property(e => e.GrammarErrors)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                          v => JsonSerializer.Deserialize<List<GrammarError>>(v, (JsonSerializerOptions?)null) ?? new List<GrammarError>()
                      );

                // Store Suggestions as JSON
                entity.Property(e => e.Suggestions)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                          v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                      );
            });
        }
    }
}
