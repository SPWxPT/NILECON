namespace Backend.Models
{
    public class Picture{
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? FilePath {get; set; }
        public string? PicType {get; set; }
        public int? Information_ID { get; set; } // This is the FK
        // public Information? Information { get; set; }
    }
}