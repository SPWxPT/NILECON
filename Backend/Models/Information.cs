using System.Collections.Generic;

namespace Backend.Models
{
    public class Information{
        public int Id { get; set; }
        public string? Headlines { get; set; }
        public string? Detail { get; set; }
        public string? Cover_pic { get; set; }
        public string? FilePath {get; set; }
         // Foreign Key
        public int? Type_ID { get; set; } // This is the FK
        // public InformationType? InformationType { get; set; }
        // public ICollection<Picture>? Pictures { get; set; }
    }

}