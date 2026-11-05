# Docker guide: Employee Management

This guide explains how the Angular frontend, .NET API, and SQL Server run
together with Docker Compose. Compose creates a separate SQL Server database;
it does not use or copy data from the existing Windows SQL Express database.

## What Docker is doing

- An **image** is a recipe-built package for an application or service.
- A **container** is a running instance of an image.
- **Docker Compose** starts the frontend, API, and SQL Server together and
  provides a private network where services can find one another by name.
- The SQL Server **volume** keeps database files when containers stop or are
  recreated.

The browser opens the Angular frontend. Nginx serves the compiled Angular
files and forwards `/api` requests to the API container. The API uses the
`sqlserver` service name to connect to SQL Server. On first startup, EF Core
applies the checked-in migrations to create the database schema.

## Before starting

1. Install and start **Docker Desktop** with Linux containers enabled.
2. Open a terminal in the `EmployeeManagement` folder.
3. Make a local environment file if one does not already exist:

   ```powershell
   if (-not (Test-Path .env)) { Copy-Item .env.example .env }
   ```

4. Open `.env` and set `MSSQL_SA_PASSWORD` to a private password. It must meet
   SQL Server's strong-password requirements. Keep `.env` private; it is
   ignored by Git. Avoid `$` in the password because Compose uses `$` for
   variable interpolation.

The current workspace already has a generated local password in `.env`; keep
that value when connecting to the Docker database in SSMS.

The example password is only a local placeholder. Do not use it outside a
disposable development environment.

## Build and start everything

From `EmployeeManagement`:

```powershell
docker compose up --build
```

The first run downloads the .NET, Node, Nginx, and SQL Server base images and
builds the application images, so it may take a few minutes. Keep this terminal
open to view logs.

Open:

- Frontend: <http://localhost:8080>
- API Swagger: <http://localhost:5274/swagger>
- SQL Server: `localhost,14333` (for example, in SSMS)

All published ports bind to `127.0.0.1`, so these development services are
available from this computer only.

In SSMS, connect to `localhost,14333` using **SQL Server Authentication**:

- Login: `sa`
- Password: the `MSSQL_SA_PASSWORD` value from your local `.env`

The Compose SQL Server starts with an empty employee table. Use the frontend to
add an employee, then run:

```sql
USE [EmployeeManagementDb];
SELECT * FROM dbo.Employees;
```

## Useful commands

Run these commands from `EmployeeManagement`:

```powershell
# See running services
docker compose ps

# Follow all service logs
docker compose logs -f

# Follow only the API logs
docker compose logs -f api

# Stop containers; keep the SQL Server volume and its data
docker compose down

# Start the existing containers again
docker compose up
```

**Warning:** `docker compose down --volumes` deletes the SQL Server data volume
and all employee records stored in the Compose database. Do not use it unless
you intentionally want to erase that Docker database.

## Configuration and migrations

- `docker-compose.yml` describes the three services, their ports, health check,
  environment, and persistent database volume.
- Each service's `Dockerfile` describes how its image is built.
- The API gets its SQL connection string from Compose environment variables;
  the Windows SQL Express development connection string is not used in Docker.
- `Database__ApplyMigrations=true` tells the API to apply EF Core migrations at
  Docker startup. This behavior is opt-in and does not change ordinary local
  API startup.
- To add a schema change, create a migration from the API project directory:

  ```powershell
  dotnet ef migrations add YourMigrationName
  ```

  Then rebuild and restart Compose:

  ```powershell
  docker compose up --build
  ```

  The API applies the new migration when it starts.

The Compose setup is intended for local learning and development. Do not expose
the sample `sa` credentials or development Swagger configuration to the
internet.
