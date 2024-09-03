using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetCoreAPISqlLite.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InformationTypeController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public InformationTypeController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Information
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InformationType>>> GetInformationTypes()
        {
            return await _context.InformationType.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InformationType>> GetInformationType(int id)
        {
            var InformationType = await _context.InformationType.FindAsync(id);

            if (InformationType == null)
            {
                return Ok(new List<InformationType>());
            }

            return InformationType;
        }

        [HttpPost]
        public async Task<ActionResult<InformationType>> PostInformationType(InformationType informationType)
        {
            _context.InformationType.Add(informationType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInformationType", new { id = informationType.Id }, informationType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInformationType(int id, InformationType informationType)
        {
            if (id != informationType.Id)
            {
                return BadRequest();
            }

            _context.Entry(informationType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InformationTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<InformationType>> DeleteInformationType(int id)
        {
            var informationType = await _context.InformationType.FindAsync(id);
            if (informationType == null)
            {
                return NotFound();
            }

            _context.InformationType.Remove(informationType);
            await _context.SaveChangesAsync();

            return informationType;
        }

        private bool InformationTypeExists(int id)
        {
            return _context.InformationType.Any(e => e.Id == id);
        }
    }
}