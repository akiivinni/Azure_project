# PeopleDesk Employee Directory

Angular standalone frontend for the existing Employee Management API.

## Run locally

Start the API at `http://localhost:5273`, then from the repository root run:

```bash
npm --prefix EmployeeManagement/EmployeeManagement.Web install
npm --prefix EmployeeManagement/EmployeeManagement.Web start
```

Open `http://localhost:4200`. The Angular development server proxies `/api`
requests to `http://localhost:5273` using `proxy.conf.json`; no API CORS changes
are needed.

## Build

```bash
npm --prefix EmployeeManagement/EmployeeManagement.Web run build
```

The production build is written to `dist/EmployeeManagement.Web`.
