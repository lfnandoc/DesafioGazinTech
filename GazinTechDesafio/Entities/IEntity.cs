using System.Data;

namespace GazinTechDesafio.Entities
{
    public interface IEntity
    {
        public abstract int Id { get; set; }

        public abstract string? Nome { get; set; }

        public abstract void MapEntity(DataRow dataRow);
    }
}
