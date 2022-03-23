using GazinTechDesafio.Infra;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;

namespace GazinTechDesafio.Entities
{
    public class EntityBase : IEntity
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string? Nome { get; set; }

        protected string? table { get; set; }

        public EntityBase()
        {
            Id = -2;
        }

        public bool Delete()
        {
            var query = new StringBuilder()
                .Append($"DELETE FROM {table}")
                .Append($"WHERE id = {Id}")
                .ToString();

            return new DBConnection().Execute(query) > 0;
        }

        public virtual void MapEntity(DataRow dataRow)
        {
            Id = Convert.ToInt32(dataRow["id"]);
            Nome = dataRow["nome"].ToString();
        }

        public bool IdAlreadyExists(int id)
        {
            var query = new StringBuilder()
              .Append($"SELECT COUNT(*) FROM {table}")
              .Append($" WHERE id = {id}")
              .ToString();

            var result = Convert.ToInt32(new DBConnection().SelectScalar(query));

            return result > 0;
        }

        public IEntity? GetById(int id) => GetByField("id", id);

        public IEntity? GetByLikeness(string field, object value)
        {
            var query = new StringBuilder()
                .Append($"SELECT * FROM {table}")
                .Append($" WHERE {field} like \'%{value.ToString()}%\'")
                .ToString();

            return SelectAndMap(query);
        }

        public IEntity? GetByField(string field, object value)
        {
            var query = new StringBuilder()
                .Append($"SELECT * FROM {table}")
                .Append($" WHERE {field} = {value.ToString()}")
                .ToString();

            return SelectAndMap(query);
        }

        private IEntity? SelectAndMap(string query)
        {         
            var result = new DBConnection().Select(query).Rows;

            if (result.Count > 0)
            {
                var entity = (IEntity?)Activator.CreateInstance(GetType());
                entity?.MapEntity(result[0]);
                return entity;
            }

            return null;
        }

        public IEnumerable<IEntity> GetAllMapped()
        {
            var query = new StringBuilder()
                .Append($"SELECT * FROM {table}")
                .ToString();

            var result = new DBConnection().Select(query).Rows;

            foreach (DataRow dataRow in result)
            {
                var entity = (IEntity?)Activator.CreateInstance(GetType());
                entity?.MapEntity(dataRow);

                if(entity != null)
                    yield return entity;
            }
        }

        public bool Save()
        {
            if (Id == -2)
                return Insert();

            return Update();
        }

        private bool Insert()
        {
            try
            {
                var properties = GetType().GetProperties().Where(property => property.Name != "Id");
                SetupColumnsToUpdate(properties, out List<string> columnsToUpdate, out List<string> valuesToUpdate);

                var query = new StringBuilder()
                    .Append($"INSERT INTO {table}")
                    .Append($" ({string.Join(',', columnsToUpdate)}) ")
                    .Append($"VALUES ({string.Join(',', valuesToUpdate)}) ");

                Id = new DBConnection().ExecuteAndReturnLastId(query.ToString());

                return Id != -2;
            }
            catch (Exception exception)
            {
                return false;
            }
        }

        private bool Update()
        {
            try
            {
                var properties = GetType().GetProperties().Where(property => property.Name != "Id");
                SetupColumnsToUpdate(properties, out List<string> columnsToUpdate, out List<string> valuesToUpdate);

                var query = new StringBuilder()
                    .Append($"UPDATE {table}")
                    .Append(" SET ");

                var updates = new StringBuilder();
                foreach (var (value, index) in columnsToUpdate.Select((v, i) => (v, i)))
                {
                    updates.Append($" {value} = {valuesToUpdate[index]},");
                }

                query.Append(updates.ToString().TrimEnd(','))
                     .Append($" WHERE id = {Id}");

                new DBConnection().Execute(query.ToString());

                return true;
            }
            catch (Exception exception)
            {
                return false;
            }
        }

        private bool SetupColumnsToUpdate(IEnumerable<PropertyInfo> properties, out List<string> columnsToUpdate, out List<string> valuesToUpdate)
        {
            columnsToUpdate = new List<String>();
            valuesToUpdate = new List<String>();

            foreach (var property in properties)
            {
                var column = (Column?)property.GetCustomAttributes(typeof(Column), true).FirstOrDefault();
                var propertyValue = property.GetValue(this);

                if (column == null || propertyValue == null)
                    continue;

                columnsToUpdate.Add(column.ColumnName);

                if (property.PropertyType.IsEnum)
                {
                    valuesToUpdate.Add(Convert.ToInt32(propertyValue).ToString());
                    continue;
                }

                if (propertyValue is string propertyValueAsString)
                {
                    valuesToUpdate.Add($"\'{propertyValueAsString}\'");
                    continue;
                }

                if (propertyValue is int propertyValueAsInt)
                {
                    valuesToUpdate.Add(propertyValueAsInt.ToString());
                    continue;
                }

                if (propertyValue is DateTime propertyValueAsDateTime)
                {
                    valuesToUpdate.Add($"\'{propertyValueAsDateTime.ToString("yyyy-MM-dd")}\'");
                    continue;
                }

                valuesToUpdate.Add($"\'{propertyValue}\'");

            }

            return columnsToUpdate.Any();               

        }

    }
}
