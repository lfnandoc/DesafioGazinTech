using GazinTechDesafio.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GazinTechDesafio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DesenvolvedorController : ControllerBase
    {
        private readonly ILogger<DesenvolvedorController> _logger;

        public DesenvolvedorController(ILogger<DesenvolvedorController> logger)
        {
            _logger = logger;
        }

        [HttpGet("count")]
        public int Get([FromQuery] string query)
        {
            return new Desenvolvedor().GetEntityCount(query);
        }

        [HttpGet("paginated/{page}")]
        public IEnumerable<Desenvolvedor> Get(int page, [FromQuery] string query)
        {
            return new Desenvolvedor().GetAllMappedAndPaginated(page, 6, query).OfType<Desenvolvedor>();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var desenvolvedor = new Desenvolvedor().GetById(id);

            if (desenvolvedor == null)
                return NotFound();

            return Ok(desenvolvedor);
        }

        [HttpPost]
        public IActionResult Post(Desenvolvedor desenvolvedor)
        {
            if (desenvolvedor.Save())
                return StatusCode(201);

            return BadRequest();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var desenvolvedor = (Desenvolvedor?)new Desenvolvedor().GetById(id);

            if (desenvolvedor?.Delete() == true)
                return NoContent();

            return BadRequest();
        }

    }
}