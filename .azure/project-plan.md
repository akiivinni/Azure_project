# Employee Management Frontend Plan

## Goal

Add a simple Angular frontend to the existing EmployeeManagement workspace.
The frontend will use the existing ASP.NET Core employee API and will not add
a separate backend or datastore.

## Location and stack

- Create the Angular application in `EmployeeManagement/EmployeeManagement.Web`.
- Use Angular CLI, TypeScript, standalone components, and CSS.
- Configure the development server to proxy `/api` requests to
  `http://localhost:5273`, avoiding a development-only API CORS change.

## Features

- Responsive employee list with search/filter.
- Create and edit forms for first name, last name, email, department, job title,
  hire date, and salary, matching `EmployeeRequest`.
- Delete employees with confirmation.
- Loading, empty, success, and API error states.
- Client-side required, email, and non-negative salary validation.
- Use the existing API routes:
  - `GET /api/employees`
  - `GET /api/employees/{id}`
  - `POST /api/employees`
  - `PUT /api/employees/{id}`
  - `DELETE /api/employees/{id}`

## Out of scope

- Authentication, new API endpoints, database changes, and deployment.

## Verification

- Install Angular dependencies and build the frontend.
- Run the frontend with the API at `http://localhost:5273`.
- Verify that the list and CRUD operations use the existing API through the
  development proxy.
