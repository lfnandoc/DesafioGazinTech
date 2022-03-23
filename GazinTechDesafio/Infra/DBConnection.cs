using System;
using System.Data;
using MySql.Data.MySqlClient;

namespace GazinTechDesafio.Infra
{
    public class DBConnection
    {
        private const string connectionString = "Server=127.0.0.1;Database=gazintech;Uid=root;Password=1234;Port=3306";

        public DBConnection()
        {
        }

        public DataTable Select(string query)
        {
            var connection = new MySqlConnection(connectionString);

            using var dataAdapter = new MySqlDataAdapter(query, connection);
            try
            {
                var tabela = new DataTable();
                dataAdapter.Fill(tabela);
                return tabela;
            }
            finally
            {
                dataAdapter.Dispose();
            }           

        }
        public object SelectScalar(string query)
        {
            var connection = new MySqlConnection(connectionString);

            using var command = new MySqlCommand(query, connection);
            try
            {
                command.Connection.Open();
                return command.ExecuteScalar();
            }
            finally
            {
                command.Connection.Close();
                command.Dispose();
            }
        }

        public int Execute(string query)
        {
            var connection = new MySqlConnection(connectionString);

            using var command = new MySqlCommand(query, connection);
            try
            {
                command.Connection.Open();
                return command.ExecuteNonQuery();
            }
            finally
            {
                command.Connection.Close();
                command.Dispose();
            }
        }
        public int ExecuteAndReturnLastId(string query)
        {
            var connection = new MySqlConnection(connectionString);

            using var command = new MySqlCommand(query, connection);
            try
            {
                command.Connection.Open();
                command.ExecuteNonQuery();
                return Convert.ToInt32(command.LastInsertedId);
            }
            finally
            {
                command.Connection.Close();
                command.Dispose();
            }
        }
    }
}
