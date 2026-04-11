# Scalability Baseline

This project now follows a few baseline rules to stay scalable as a client-facing product grows.

## Backend Standards

- Keep startup logic separated from app setup:
  - `src/server.js`: process lifecycle and startup orchestration.
  - `src/app.js`: express app and middleware composition.
  - `src/config/*`: environment and database concerns.
- Validate required environment variables on boot.
- Use graceful shutdown for `SIGINT` and `SIGTERM`.
- Add new API modules by feature (for example: `src/modules/auth`, `src/modules/catalog`) with:
  - `controller.js`
  - `service.js`
  - `routes.js`
  - `schema.js` (if validation is needed)

## Frontend Standards

- Keep route-level code splitting enabled for all page-level routes.
- Prefer feature folders for growth:
  - `src/features/<feature-name>/components`
  - `src/features/<feature-name>/api`
  - `src/features/<feature-name>/state`
- Keep shared UI and utilities in dedicated shared folders.

## Delivery Guardrails

- Every new backend feature should include:
  - input validation
  - consistent error response shape
  - at least one integration or API test
- Every new frontend feature should include:
  - lazy route if page-level
  - loading and error states
  - responsive behavior check

## Next Technical Steps

- Add a shared lint + format setup for backend and frontend.
- Add API versioning (`/api/v1`) before adding more endpoints.
- Add request logging and centralized error middleware.
- Add CI checks for lint and build before merge.
