using System;

namespace Essaychi.Domain.Entities
{
    public class Essay
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
        public AnalysisResult? AnalysisResult { get; set; }
    }
}
