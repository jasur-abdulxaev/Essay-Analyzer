using System.Threading.Tasks;
using Essaychi.Domain.Entities;

namespace Essaychi.Application.Interfaces
{
    public interface IOpenAIService
    {
        Task<AnalysisResult> EvaluateEssayAsync(string essayContent);
    }
}
