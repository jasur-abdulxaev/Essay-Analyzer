using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;
using Essaychi.Application.Interfaces;
using Essaychi.Domain.Entities;

namespace Essaychi.Infrastructure.Services
{
    public class OpenAIService : IOpenAIService
    {
        private readonly ChatClient _chatClient;
        private readonly string _systemPrompt = @"
You are an IELTS examiner and CEFR language expert. Analyze the essay strictly based on IELTS band descriptors. Provide objective, structured feedback. Do not hallucinate. Be precise.
Your response MUST be exclusively a pure JSON object mapping strictly to this structure:
{
  ""wordCount"": 0,
  ""sentenceCount"": 0,
  ""ieltsBand"": 0.0,
  ""cefrLevel"": """",
  ""grammarErrors"": [
    {
      ""original"": """",
      ""corrected"": """",
      ""explanation"": """"
    }
  ],
  ""suggestions"": [ """" ],
  ""improvedEssay"": """"
}
Do not include markdown blocks like ```json or any other text before/after the JSON. Just return the JSON.";

        public OpenAIService(IConfiguration configuration)
        {
            var apiKey = configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("OpenAI API Key is not configured.");
            }
            
            // Assuming we use gpt-4o-mini for fast evaluation or gpt-4o for better accuracy
            // Defaulting to gpt-4o-mini for cost efficiency while maintaining good response
            _chatClient = new ChatClient("gpt-4o-mini", apiKey);
        }

        public async Task<AnalysisResult> EvaluateEssayAsync(string essayContent)
        {
            var options = new ChatCompletionOptions
            {
                Temperature = 0.2f // Low temperature for more deterministic analysis
            };

            var messages = new ChatMessage[]
            {
                new SystemChatMessage(_systemPrompt),
                new UserChatMessage($"Analyze the following essay:\n\n{essayContent}")
            };

            var completionResult = await _chatClient.CompleteChatAsync(messages, options);
            var responseContent = completionResult.Value.Content[0].Text;

            // Optional: aggressive cleaning if LLM returns ```json wrappers
            responseContent = responseContent.Trim();
            if (responseContent.StartsWith("```json"))
            {
                responseContent = responseContent.Substring(7);
            }
            if (responseContent.EndsWith("```"))
            {
                responseContent = responseContent.Substring(0, responseContent.Length - 3);
            }
            responseContent = responseContent.Trim();

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var analysisResultDto = JsonSerializer.Deserialize<AnalysisResult>(responseContent, jsonOptions);

            if (analysisResultDto == null)
            {
                throw new Exception("Failed to parse AI analysis result. Ensure the AI responded with correct JSON.");
            }

            return analysisResultDto;
        }
    }
}
