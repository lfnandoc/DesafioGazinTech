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

        [HttpGet]
        public IEnumerable<Desenvolvedor> Get()
        {
            return new Desenvolvedor().GetAllMapped().OfType<Desenvolvedor>();
        }

    }
}