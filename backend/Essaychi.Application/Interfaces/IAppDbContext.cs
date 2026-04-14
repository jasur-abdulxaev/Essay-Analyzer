using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Essaychi.Domain.Entities;

namespace Essaychi.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Essay> Essays { get; set; }
        DbSet<AnalysisResult> AnalysisResults { get; set; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
