using System;
using System.Collections.Generic;

namespace Essaychi.Domain.Entities
{
    public class AnalysisResult
    {
        public Guid Id { get; set; }
        public Guid EssayId { get; set; }
        
        public int WordCount { get; set; }
        public int SentenceCount { get; set; }
        public double IeltsBand { get; set; }
        public string CefrLevel { get; set; } = string.Empty;
        
        // Let's store complex types as JSON string, or map them with EF Core owned entities.
        // For simplicity and alignment with JSON requirement, we will use JSON mapping in EF.
        public List<GrammarError> GrammarErrors { get; set; } = new();
        public List<string> Suggestions { get; set; } = new();
        
        public string ImprovedEssay { get; set; } = string.Empty;

        public Essay? Essay { get; set; }
    }

    public class GrammarError
    {
        public string Original { get; set; } = string.Empty;
        public string Corrected { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
    }
}
