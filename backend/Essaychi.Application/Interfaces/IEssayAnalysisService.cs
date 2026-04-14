using System;
using System.Threading.Tasks;
using Essaychi.Domain.Entities;

namespace Essaychi.Application.Interfaces
{
    public interface IEssayAnalysisService
    {
        Task<AnalysisResult> AnalyzeAndSaveEssayAsync(string clerkUserId, string content);
        Task<IEnumerable<Essay>> GetHistoryAsync(string clerkUserId);
    }
}
