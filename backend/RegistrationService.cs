using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CampusEventManager.Backend
{
    public sealed class RegistrationService
    {
        private readonly string _connectionString;

        public RegistrationService(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new ArgumentException("A connection string is required.", nameof(connectionString));
            }

            _connectionString = connectionString;
        }

        public IReadOnlyList<RegistrationDetails> GetUserRegistrations(string inputEmail)
        {
            if (string.IsNullOrWhiteSpace(inputEmail))
            {
                throw new ArgumentException("An email address is required.", nameof(inputEmail));
            }

            const string sql = @"
                SELECT r.RegistrationId, r.EventId, r.RegisteredAt, r.Status
                FROM dbo.Registrations AS r
                INNER JOIN dbo.Users AS u ON u.UserId = r.UserId
                WHERE u.Email = @Email
                ORDER BY r.RegisteredAt DESC, r.RegistrationId DESC;";

            var registrations = new List<RegistrationDetails>();

            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(sql, connection))
            {
                command.Parameters.Add("@Email", SqlDbType.NVarChar, 256).Value = inputEmail.Trim();
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        registrations.Add(new RegistrationDetails(
                            reader.GetInt32(0),
                            reader.GetInt32(1),
                            reader.GetDateTime(2),
                            reader.GetString(3)));
                    }
                }
            }

            return registrations;
        }
    }

    public sealed class RegistrationDetails
    {
        public RegistrationDetails(int registrationId, int eventId, DateTime registeredAt, string status)
        {
            RegistrationId = registrationId;
            EventId = eventId;
            RegisteredAt = registeredAt;
            Status = status;
        }

        public int RegistrationId { get; }
        public int EventId { get; }
        public DateTime RegisteredAt { get; }
        public string Status { get; }
    }
}