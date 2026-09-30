# SUBMISSION

**Project:** Online Campus Event Management System
**Course:** Applied Generative AI for IT Solution Development — Group Hands-On Laboratory Examination

## Team Roster

| Member | Name | Assigned Role | Core Responsibilities |
|--------|------|---------------|-----------------------|
| Member 1 | [Name] | Systems Architect & Prompt Lead | Task 1 (Requirements & Prompt Engineering) + Task 5 (Documentation & Integration) |
| Member 2 | [Name] | Frontend Engineer | Task 2 (AI-Assisted UI & WCAG Accessibility) |
| Member 3 | [Name] | Database & Backend Engineer | Task 3 (3NF Schemas, Mermaid.js ERD & SQL Scripts) |
| Member 4 | [Name] | QA & Security Engineer | Task 4 (Shift-Left Unit Testing & Vulnerability Refactoring) |

## Setup Instructions

1. [Clone the repository: `git clone [repository URL]`]
2. [Frontend: open `/frontend/index.html` in a browser.]
3. [Database: run `/database/schema.sql` against [SQL Server / target DB].]
4. Tests: run `node --test frontend/script.test.js`. The backend source requires a .NET project referencing `Microsoft.Data.SqlClient` and a configured SQL Server connection string.

## Deliverables

| Task | Deliverable | Location |
|------|-------------|----------|
| Task 1 | RCTC prompts, AI outputs, grounding evaluation | [docs/prompts.md](docs/prompts.md) |
| Task 2 | Event Catalog & Registration Form UI | [frontend/](frontend/) |
| Task 3 | 3NF schema, Mermaid.js ERD, DDL script | [database/schema.sql](database/schema.sql) |
| Task 4 | Unit tests and refactored registration service | [backend/RegistrationService.cs](backend/RegistrationService.cs) |
| Task 5 | Group verification log | [docs/verification-logs.md](docs/verification-logs.md) |

## Task 1: Requirements Analysis & Prompt Architecture

The full RCTC prompts table, exact AI outputs, and manual grounding evaluation are in [docs/prompts.md](docs/prompts.md).

## Task 2: AI-Assisted Frontend Development

UI code is in [frontend/](frontend/).

[Brief notes on the AI tool used, semantic HTML5 structure, and WCAG features implemented.]

## Task 3: Database Design & ERD Generation

DDL script: [database/schema.sql](database/schema.sql)

### Entity-Relationship Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned_to"
    VENUES ||--o{ EVENTS : "hosts"
    USERS ||--o{ REGISTRATIONS : "submits"
    EVENTS ||--o{ REGISTRATIONS : "records"

    ROLES {
        INT RoleId PK
        NVARCHAR RoleName UK
    }

    USERS {
        INT UserId PK
        NVARCHAR StudentId UK
        NVARCHAR FullName
        NVARCHAR Email UK
        NVARCHAR PasswordHash
        INT RoleId FK
        DATETIME2 CreatedAt
    }

    VENUES {
        INT VenueId PK
        NVARCHAR VenueName
        NVARCHAR LocationDetails
        INT Capacity
    }

    EVENTS {
        INT EventId PK
        NVARCHAR EventCode UK
        NVARCHAR Title
        NVARCHAR Description
        NVARCHAR Category
        DATETIME2 EventDate
        INT VenueId FK
        INT MaxCapacity
        BIT IsActive
    }

    REGISTRATIONS {
        INT RegistrationId PK
        INT UserId FK
        INT EventId FK
        DATETIME2 RegisteredAt
        NVARCHAR Status
    }
```

The `ROLES` entity establishes a one-to-many relationship with `USERS`, allowing role-based access control between students and administrators without duplicating authorization metadata. `VENUES` and `EVENTS` maintain a one-to-many relationship where venue capacity and location are stored independently of specific event schedules to eliminate update anomalies. `REGISTRATIONS` functions as a fully normalized associative entity bridging `USERS` and `EVENTS` in a many-to-many structure, ensuring attendee profiles and event capacities are referenced via foreign keys rather than redundant derived columns.

## Task 4: Shift-Left Testing, Security & Refactoring

- Refactored solution: [backend/RegistrationService.cs](backend/RegistrationService.cs)
- Unit tests: [frontend/script.test.js](frontend/script.test.js)

The original query concatenated email into SQL, referenced an `Email` column absent from `Registrations`, and did not dispose its connection or command. The refactored [RegistrationService](backend/RegistrationService.cs) joins `Users` to `Registrations`, uses a typed SQL parameter, and disposes the connection, command, and reader. It returns a list because a user may have multiple registrations; no matches produce an empty list.

## Task 5: Group Integration & Verification Report

### AI Disclosure Statement

[Declaration of all AI tools used during the exam (tool names/versions) and how their outputs were verified.]

### Group Verification Log

The full verification log table is in [docs/verification-logs.md](docs/verification-logs.md).
