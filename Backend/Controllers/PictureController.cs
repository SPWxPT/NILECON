using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPISqlLite.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PictureController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public PictureController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Picture>>> GetPictures()
        {
            return await _context.Picture.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Picture>> GetPicture(int id)
        {
            var picture = await _context.Picture.FindAsync(id);

            if (picture == null)
            {
                return Ok(new List<Picture>());
            }

            return picture;
        }

        [HttpGet("picMain/{id}")]
        public async Task<IActionResult> GetPictureByIdAndPicType(int id)
        {
            var picture = await _context.Picture
                .Where(p => p.Information_ID == id && p.PicType == "main")
                .ToListAsync();

            if (picture == null)
            {
                return NotFound();
            }

            return Ok(picture);
        }

        [HttpGet("picSub/{id}")]
        public async Task<IActionResult> GetPictureSubByIdAndPicType(int id)
        {
            var picture = await _context.Picture
                .Where(p => p.Information_ID == id && p.PicType == "sub")
                .ToListAsync();

            if (picture == null)
            {
                return NotFound();
            }

            return Ok(picture);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> UploadPicture([FromForm] IFormFile file, [FromForm] string picType, [FromForm] int? information_ID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // กำหนด path ที่จะเก็บรูปภาพ
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", file.FileName);

            // ตรวจสอบว่ามีไฟล์นี้อยู่แล้วหรือไม่
            if (System.IO.File.Exists(path))
                return BadRequest("File already exists.");

            // อัปโหลดไฟล์ไปยัง path ที่กำหนด
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // เก็บข้อมูลไฟล์ลงในฐานข้อมูล
            var pictureFile = new Picture
            {
                FileName = file.FileName,
                FilePath = $"/images/{file.FileName}",
                PicType = picType,
                Information_ID = information_ID
            };

            _context.Picture.Add(pictureFile);
            await _context.SaveChangesAsync();

            return Ok(new { pictureFile.Id, pictureFile.FileName, pictureFile.FilePath, pictureFile.PicType, pictureFile.Information_ID });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePicture(int id, IFormFile file, [FromForm] string picType, [FromForm] int? informationId)
        {
            var picture = await _context.Picture.FindAsync(id);
            if (picture == null)
                return NotFound("Picture not found.");

            if (file != null && file.Length > 0)
            {
                // ลบไฟล์เก่าออก
                if (!string.IsNullOrEmpty(picture.FilePath))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", picture.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำ
                // var uniqueFileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
                var fileName = Path.GetFileName(file.FileName);

                // กำหนด path ที่จะเก็บรูปภาพใหม่
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                // อัปโหลดไฟล์ใหม่ไปยัง path ที่กำหนด
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // อัปเดตข้อมูลไฟล์
                picture.FileName = fileName;
                picture.FilePath = $"/images/{fileName}";
            }

            // อัปเดตข้อมูลอื่น ๆ
            picture.PicType = picType;
            picture.Information_ID = informationId;

            _context.Picture.Update(picture);
            await _context.SaveChangesAsync();

            return Ok(new { picture.Id, picture.FileName, picture.FilePath, picture.PicType, picture.Information_ID });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Picture>> DeletePicture(int id)
        {
            var picture = await _context.Picture.FindAsync(id);
            if (picture == null)
            {
                return NotFound();
            }

            _context.Picture.Remove(picture);
            await _context.SaveChangesAsync();

            return picture;
        }
    }
}