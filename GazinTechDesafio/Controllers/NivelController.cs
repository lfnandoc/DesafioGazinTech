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

        [HttpGet]
        public IEnumerable<Nivel> Get()
        {
            return new Nivel().GetAllMapped().OfType<Nivel>();
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
                return Ok();

            return BadRequest();
        }

    }
}