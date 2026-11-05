# Get Started with Employee Management

Follow these steps to run the employee management app on a new Windows computer.

## 1. Get the project

Download or clone the project from your team's repository, or extract the ZIP
file. Find the `EmployeeManagement` folder containing `docker-compose.yml`.

## 2. Install Docker Desktop

Install Docker Desktop for Windows, open it, and wait until it has started.
Docker Desktop must be running before you can start the app.

## 3. Open PowerShell in the project folder

In PowerShell, change to the `EmployeeManagement` folder. For example:

```powershell
cd C:\path\to\EmployeeManagement
```

Check that the folder contains `docker-compose.yml`:

```powershell
Get-ChildItem docker-compose.yml
```

## 4. Set up your local database password

Create your own local environment file and edit it:

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace the example `MSSQL_SA_PASSWORD` with a strong password of your own,
then save and close Notepad. Do not share your `.env` file; it contains your
database password.

## 5. Build and start the app

In the same PowerShell window and folder, run:

```powershell
docker compose up --build -d
```

The first run can take a few minutes while Docker downloads and builds the
frontend, backend, and SQL Server. EF Core applies the database migrations
automatically when the API starts.

Check that the services are running:

```powershell
docker compose ps
```

## 6. Open the app

- Employee management UI: <http://localhost:8080>
- API Swagger page: <http://localhost:5274/swagger>

The SQL Server is available at `localhost,14333`. In SQL Server Management
Studio, connect using **SQL Server Authentication**:

- Login: `sa`
- Password: the `MSSQL_SA_PASSWORD` you set in `.env`

Each installation has its own separate, initially empty database. Add an
employee through the UI, then you can view the records in SSMS:

```sql
USE [EmployeeManagementDb];
SELECT * FROM dbo.Employees;
```

## 7. Stop the app and start it again

From the `EmployeeManagement` folder, stop the containers while keeping the
database and its records:

```powershell
docker compose down
```

Start them again later with:

```powershell
docker compose up -d
```

Do not run `docker compose down --volumes` unless you intend to delete the
Docker database and all records saved in it.

For more information about the Docker setup, networking, and migrations, see
[DOCKER.md](./DOCKER.md).
