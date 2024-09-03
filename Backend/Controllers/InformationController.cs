using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPISqlLite.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InformationController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public InformationController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Information
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Information>>> GetInformations()
        {
            return await _context.Information.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Information>> GetInformation(int id)
        {
            var Information = await _context.Information.FindAsync(id);

            if (Information == null)
            {
                return Ok(new List<Information>());
            }

            return Information;
        }

        [HttpGet("type/{id}")]
        public async Task<ActionResult<IEnumerable<Information>>> GetInformationByTypeId(int id)
        {
            var informations = await _context.Information
                                             .Where(info => info.Type_ID == id)
                                             .Take(8) // Limit to 10 records
                                             .ToListAsync();

            if (informations == null || informations.Count == 0)
            {
                return NotFound();
            }

            return Ok(informations);
        }

        [HttpPost]
        public async Task<ActionResult<Information>> PostInformation([FromForm] IFormFile file, [FromForm] string Headlines, [FromForm] string Detail, [FromForm] int? Type_ID)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // สร้างชื่อไฟล์ที่ไม่ซ้ำ
            // var uniqueFileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
            var fileName = Path.GetFileName(file.FileName);

            // กำหนด path ที่จะเก็บรูปภาพ
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

            // ตรวจสอบว่ามีไฟล์นี้อยู่แล้วหรือไม่
            if (System.IO.File.Exists(path))
                return BadRequest("File already exists.");

            // อัปโหลดไฟล์ไปยัง path ที่กำหนด
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // เก็บข้อมูลไฟล์ลงในฐานข้อมูล
            var informationList = new Information
            {
                Cover_pic = file.FileName,
                FilePath = $"/images/{file.FileName}",
                Headlines = Headlines,
                Detail = Detail,
                Type_ID = Type_ID
            };

            // เก็บข้อมูลในฐานข้อมูล
            _context.Information.Add(informationList);
            await _context.SaveChangesAsync();

            return Ok(new { informationList.Id, informationList.Headlines, informationList.Detail, informationList.Cover_pic, informationList.FilePath, informationList.Type_ID });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutInformation(int id, IFormFile file, [FromForm] string Headlines, [FromForm] string Detail, [FromForm] int? Type_ID)
        {
            var information = await _context.Information.FindAsync(id);
            if (information == null)
                return NotFound("information not found.");

            if (file != null && file.Length > 0)
            {
                // ลบไฟล์เก่าออก
                if (!string.IsNullOrEmpty(information.FilePath))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", information.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                // // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำ
                // var uniqueFileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
                var fileName = Path.GetFileName(file.FileName);

                // กำหนด path ที่จะเก็บรูปภาพใหม่
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                // ตรวจสอบว่ามีไฟล์นี้อยู่แล้วหรือไม่
                // if (System.IO.File.Exists(path))
                //     return BadRequest("File with the same name already exists.");

                // อัปโหลดไฟล์ใหม่ไปยัง path ที่กำหนด
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // อัปเดตข้อมูลไฟล์
                information.Cover_pic = fileName;
                information.FilePath = $"/images/{fileName}";
            }

            // อัปเดตข้อมูลอื่น ๆ
            information.Headlines = Headlines;
            information.Detail = Detail;
            information.Type_ID = Type_ID;

            _context.Information.Update(information);
            await _context.SaveChangesAsync();

            return Ok(new { information.Id, information.Headlines, information.Detail, information.Cover_pic, information.FilePath, information.Type_ID });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Information>> DeleteInformation(int id)
        {
            var information = await _context.Information.FindAsync(id);
            if (information == null)
            {
                return NotFound();
            }

            _context.Information.Remove(information);
            await _context.SaveChangesAsync();

            return information;
        }

        private bool InformationExists(int id)
        {
            return _context.Information.Any(e => e.Id == id);
        }
    }
}