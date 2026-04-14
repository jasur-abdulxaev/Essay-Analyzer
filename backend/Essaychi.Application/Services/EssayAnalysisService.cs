using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Essaychi.Application.Interfaces;
using Essaychi.Domain.Entities;

namespace Essaychi.Application.Services
{
    public class EssayAnalysisService : IEssayAnalysisService
    {
        private readonly IAppDbContext _context;
        private readonly IOpenAIService _openAIService;

        public EssayAnalysisService(IAppDbContext context, IOpenAIService openAIService)
        {
            _context = context;
            _openAIService = openAIService;
        }

        public async Task<AnalysisResult> AnalyzeAndSaveEssayAsync(string clerkUserId, string content)
        {
            // 1. Find or create user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);
            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    ClerkUserId = clerkUserId,
                    Email = "pending@placeholder.com", // You'd sync actual email depending on Clerk webhooks or client payload
                    CreatedAt = DateTime.UtcNow
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // 2. Call OpenAI for analysis
            var analysisResultDto = await _openAIService.EvaluateEssayAsync(content);

            // 3. Save Essay
            var essay = new Essay
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Content = content,
                CreatedAt = DateTime.UtcNow
            };
            _context.Essays.Add(essay);

            // 4. Map and save AnalysisResult
            analysisResultDto.Id = Guid.NewGuid();
            analysisResultDto.EssayId = essay.Id;
            
            _context.AnalysisResults.Add(analysisResultDto);

            await _context.SaveChangesAsync();

            return analysisResultDto;
        }

        public async Task<IEnumerable<Essay>> GetHistoryAsync(string clerkUserId)
        {
            return await _context.Essays
                .Include(e => e.AnalysisResult)
                .Where(e => e.User!.ClerkUserId == clerkUserId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }
    }
}
