using GazinTechDesafio.Infra;
using System.Data;

namespace GazinTechDesafio.Entities
{
    public enum Genero
    {
        Masculino = 0,
        Feminino = 1,
        Outro = 2
    }

    public class Desenvolvedor : EntityBase
    {
        [Column("genero")]
        public Genero Genero { get; set; }

        [Column("dataDeNascimento")]
        public DateTime DataDeNascimento { get; set; }

        [Column("hobby")]
        public string? Hobby { get; set; }

        [Column("nivel")]
        public int Nivel { get; set; }            

        public string? NivelName { get => new Nivel().GetById(Nivel)?.Nome; }


        public Desenvolvedor() : base()
        {
            table = "desenvolvedores";
        }

        public override void MapEntity(DataRow dataRow)
        {
            base.MapEntity(dataRow);
            DataDeNascimento = (DateTime)dataRow["dataDeNascimento"];
            Nivel = Convert.ToInt32(dataRow["nivel"]);
            Hobby = dataRow["hobby"].ToString();
            Genero = (Genero)Convert.ToInt32(dataRow["genero"]);            
        }
    }
}
