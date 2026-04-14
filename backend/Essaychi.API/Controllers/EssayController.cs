using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Essaychi.Application.Interfaces;
using System.Security.Claims;

namespace Essaychi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EssayController : ControllerBase
    {
        private readonly IEssayAnalysisService _essayAnalysisService;

        public EssayController(IEssayAnalysisService essayAnalysisService)
        {
            _essayAnalysisService = essayAnalysisService;
        }

        public class AnalyzeRequest
        {
            public string Content { get; set; } = string.Empty;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] AnalyzeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Essay content cannot be empty.");
            }

            var clerkUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var result = await _essayAnalysisService.AnalyzeAndSaveEssayAsync(clerkUserId, request.Content);

            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var clerkUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var history = await _essayAnalysisService.GetHistoryAsync(clerkUserId);
            return Ok(history);
        }
    }
}
