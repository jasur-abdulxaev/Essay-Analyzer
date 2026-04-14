using System;
using System.Collections.Generic;

namespace Essaychi.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string ClerkUserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public ICollection<Essay> Essays { get; set; } = new List<Essay>();
    }
}
