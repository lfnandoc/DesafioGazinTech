using GazinTechDesafio.Infra;
using System.Data;
using System.Text;

namespace GazinTechDesafio.Entities
{
    public class Nivel : Entity
    {
        [Column("nome")]
        public string? Nome { get; set; }

        public int DesenvolvedoresAssociados { get; set; }

        public Nivel() : base()
        {
            table = "niveis";
        }

        public override void MapEntity(DataRow dataRow)
        {
            base.MapEntity(dataRow);
            Nome = dataRow["nome"].ToString();
            DesenvolvedoresAssociados = GetDesenvolvedoresAssociadosCount();
        }

        public int GetDesenvolvedoresAssociadosCount()
        {
            if (Id == -2)
                return 0;

            var query = new StringBuilder()
                .Append($"SELECT COUNT(*) FROM desenvolvedores")
                .Append($" WHERE nivel = {Id}")
                .ToString();

            var result = Convert.ToInt32(new DBConnection().SelectScalar(query));

            return result;
        }
    }
}
