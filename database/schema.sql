-- ============================================================================
-- Script: schema.sql
-- Description: Production-grade T-SQL DDL schema and seed data for the
--              Online Campus Event Management System.
-- Target DBMS: Microsoft SQL Server 2019+
-- Author: Harvey (Database & Backend Engineer)
-- Normal Form: 3rd Normal Form (3NF)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Database Creation (Idempotent)
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'CampusEventDB')
BEGIN
    CREATE DATABASE CampusEventDB;
END;
GO

USE CampusEventDB;
GO

-- ----------------------------------------------------------------------------
-- 2. Drop Existing Tables in Reverse Dependency Order
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Registrations', N'U') IS NOT NULL DROP TABLE dbo.Registrations;
IF OBJECT_ID(N'dbo.Events', N'U') IS NOT NULL DROP TABLE dbo.Events;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DROP TABLE dbo.Users;
IF OBJECT_ID(N'dbo.Venues', N'U') IS NOT NULL DROP TABLE dbo.Venues;
IF OBJECT_ID(N'dbo.Roles', N'U') IS NOT NULL DROP TABLE dbo.Roles;
GO

-- ----------------------------------------------------------------------------
-- 3. Table Creation (3NF Compliant)
-- ----------------------------------------------------------------------------

-- Table 1: Roles
CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) NOT NULL,
    RoleName NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_Roles PRIMARY KEY CLUSTERED (RoleId),
    CONSTRAINT UQ_Roles_RoleName UNIQUE (RoleName)
);
GO

-- Table 2: Venues
CREATE TABLE dbo.Venues (
    VenueId INT IDENTITY(1,1) NOT NULL,
    VenueName NVARCHAR(100) NOT NULL,
    LocationDetails NVARCHAR(255) NULL,
    Capacity INT NOT NULL,
    CONSTRAINT PK_Venues PRIMARY KEY CLUSTERED (VenueId),
    CONSTRAINT CK_Venues_Capacity CHECK (Capacity > 0)
);
GO

-- Table 3: Users
CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) NOT NULL,
    StudentId NVARCHAR(20) NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(256) NOT NULL,
    RoleId INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSDATETIME(),
    CONSTRAINT PK_Users PRIMARY KEY CLUSTERED (UserId),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) 
        REFERENCES dbo.Roles (RoleId) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_StudentId UNIQUE (StudentId),
    CONSTRAINT CK_Users_Email_Domain CHECK (Email LIKE '%_@univ.edu.ph'),
    CONSTRAINT CK_Users_StudentId_Format CHECK (StudentId IS NULL OR StudentId LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9][0-9]')
);
GO

-- Table 4: Events
CREATE TABLE dbo.Events (
    EventId INT IDENTITY(1,1) NOT NULL,
    EventCode NVARCHAR(20) NOT NULL,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(1000) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    EventDate DATETIME2(0) NOT NULL,
    VenueId INT NOT NULL,
    MaxCapacity INT NOT NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Events_IsActive DEFAULT 1,
    CONSTRAINT PK_Events PRIMARY KEY CLUSTERED (EventId),
    CONSTRAINT FK_Events_Venues FOREIGN KEY (VenueId) 
        REFERENCES dbo.Venues (VenueId) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    CONSTRAINT UQ_Events_EventCode UNIQUE (EventCode),
    CONSTRAINT CK_Events_MaxCapacity CHECK (MaxCapacity > 0),
    CONSTRAINT CK_Events_Category CHECK (Category IN ('Career', 'Workshop', 'Sports', 'Seminar', 'Culture', 'Academic'))
);
GO

-- Table 5: Registrations
CREATE TABLE dbo.Registrations (
    RegistrationId INT IDENTITY(1,1) NOT NULL,
    UserId INT NOT NULL,
    EventId INT NOT NULL,
    RegisteredAt DATETIME2(0) NOT NULL CONSTRAINT DF_Registrations_RegisteredAt DEFAULT SYSDATETIME(),
    Status NVARCHAR(20) NOT NULL CONSTRAINT DF_Registrations_Status DEFAULT 'Confirmed',
    CONSTRAINT PK_Registrations PRIMARY KEY CLUSTERED (RegistrationId),
    CONSTRAINT FK_Registrations_Users FOREIGN KEY (UserId) 
        REFERENCES dbo.Users (UserId) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT FK_Registrations_Events FOREIGN KEY (EventId) 
        REFERENCES dbo.Events (EventId) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT UQ_Registrations_UserId_EventId UNIQUE (UserId, EventId),
    CONSTRAINT CK_Registrations_Status CHECK (Status IN ('Confirmed', 'Cancelled', 'Waitlisted', 'Attended'))
);
GO

-- ----------------------------------------------------------------------------
-- 4. Non-Clustered Indexes on Foreign Key Columns
-- ----------------------------------------------------------------------------
CREATE NONCLUSTERED INDEX IX_Users_RoleId ON dbo.Users (RoleId);
CREATE NONCLUSTERED INDEX IX_Events_VenueId ON dbo.Events (VenueId);
CREATE NONCLUSTERED INDEX IX_Registrations_UserId ON dbo.Registrations (UserId);
CREATE NONCLUSTERED INDEX IX_Registrations_EventId ON dbo.Registrations (EventId);
GO

-- ----------------------------------------------------------------------------
-- 5. Seed Initial Data
-- ----------------------------------------------------------------------------

-- Seed Roles
INSERT INTO dbo.Roles (RoleName)
VALUES 
    (N'Administrator'),
    (N'Student');

-- Seed Venues
INSERT INTO dbo.Venues (VenueName, LocationDetails, Capacity)
VALUES 
    (N'University Gymnasium', N'Main Campus East Wing', 120),
    (N'IT Building, Lab 3', N'Computer Studies Bldg 2nd Floor', 30),
    (N'Main Field', N'Sports Complex Oval', 500),
    (N'Audio-Visual Room', N'Central Library Bldg 3rd Floor', 50),
    (N'Open Amphitheater', N'Student Plaza Central', 200),
    (N'Library Lobby', N'Main Library Ground Floor', 80);

-- Seed Users (1 Admin, 5 Students)
INSERT INTO dbo.Users (StudentId, FullName, Email, PasswordHash, RoleId)
VALUES 
    (NULL, N'Admin Maria Santos', N'msantos@univ.edu.ph', N'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 1),
    (N'2021-00101', N'Juan Dela Cruz', N'jdelacruz@univ.edu.ph', N'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 2),
    (N'2021-00102', N'Clara Reyes', N'creyes@univ.edu.ph', N'8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 2),
    (N'2022-00203', N'Mateo Garcia', N'mgarcia@univ.edu.ph', N'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 2),
    (N'2022-00204', N'Sofia Lopez', N'slopez@univ.edu.ph', N'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 2),
    (N'2023-00305', N'Diego Fernandez', N'dfernandez@univ.edu.ph', N'4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 2);

-- Seed Events (Synced with Frontend Catalog)
INSERT INTO dbo.Events (EventCode, Title, Description, Category, EventDate, VenueId, MaxCapacity, IsActive)
VALUES 
    (N'evt-101', N'Tech Career Fair 2026', N'Meet recruiters from 30+ IT companies and bring your resume for on-the-spot interviews.', N'Career', '2026-10-14 09:00:00', 1, 120, 1),
    (N'evt-102', N'Generative AI Workshop', N'Hands-on session on prompt engineering and building apps with AI assistants.', N'Workshop', '2026-10-21 13:00:00', 2, 30, 1),
    (N'evt-103', N'Intramurals Opening Ceremony', N'Parade of colleges, torch lighting and the first round of the basketball league.', N'Sports', '2026-10-28 07:30:00', 3, 500, 1),
    (N'evt-104', N'Cybersecurity Awareness Talk', N'Learn how to spot phishing, secure your accounts and protect student data.', N'Seminar', '2026-11-05 15:00:00', 4, 3, 1),
    (N'evt-105', N'Campus Music Night', N'Student bands and solo artists perform live. Free entry for registered students.', N'Culture', '2026-11-12 18:00:00', 5, 200, 1),
    (N'evt-106', N'Capstone Project Expo', N'Graduating students demo their capstone systems to faculty and industry panelists.', N'Academic', '2026-11-19 10:00:00', 6, 80, 1);

-- Seed Registrations
INSERT INTO dbo.Registrations (UserId, EventId, RegisteredAt, Status)
VALUES 
    (2, 1, '2026-09-25 08:30:00', N'Confirmed'),
    (3, 1, '2026-09-25 09:15:00', N'Confirmed'),
    (4, 1, '2026-09-26 10:00:00', N'Confirmed'),
    (2, 2, '2026-09-26 11:30:00', N'Confirmed'),
    (5, 2, '2026-09-27 14:00:00', N'Confirmed'),
    (6, 4, '2026-09-28 16:45:00', N'Confirmed');
GO

-- ----------------------------------------------------------------------------
-- 6. Administrator Verification Query: View Registered Attendees per Event
-- ----------------------------------------------------------------------------
SELECT 
    e.EventCode,
    e.Title AS EventTitle,
    v.VenueName,
    e.EventDate,
    u.StudentId,
    u.FullName AS AttendeeName,
    u.Email AS AttendeeEmail,
    r.RegisteredAt,
    r.Status AS RegistrationStatus
FROM dbo.Registrations r
INNER JOIN dbo.Events e ON r.EventId = e.EventId
INNER JOIN dbo.Users u ON r.UserId = u.UserId
INNER JOIN dbo.Venues v ON e.VenueId = v.VenueId
WHERE e.EventCode = N'evt-101' AND r.Status = N'Confirmed'
ORDER BY r.RegisteredAt ASC;
GO
