using GazinTechDesafio.Entities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GazinTechDesafio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NivelController : ControllerBase
    {
        private readonly ILogger<NivelController> _logger;

        public NivelController(ILogger<NivelController> logger)
        {
            _logger = logger;
        }

        [HttpGet("count")]
        public int GetCount([FromQuery] string query)
        {
            return new Nivel().GetEntityCount(query);
        }

        [HttpGet("all")]
        public IEnumerable<Nivel> GetAll()
        {
            return new Nivel().GetAllMapped().OfType<Nivel>();
        }

        [HttpGet("paginated/{page}")]
        public IEnumerable<Nivel> Get(int page, [FromQuery] string query)
        {
            return new Nivel().GetAllMappedAndPaginated(page, 6, query).OfType<Nivel>();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var nivel = new Nivel().GetById(id);

            if (nivel == null)
                return NotFound();

            return Ok(nivel);
        }

        [HttpPost]
        public IActionResult Post(Nivel nivel)
        {           
            if(nivel.Save())
                return StatusCode(201);

            return BadRequest();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var nivelOnDb = (Nivel?) new Nivel().GetById(id);

            if (nivelOnDb?.DesenvolvedoresAssociados > 0)
                return StatusCode(501);

            if (nivelOnDb?.Delete() == true)
                return NoContent();

            return BadRequest();
        }

    }
}