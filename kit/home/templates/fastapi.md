# FastAPI conventions

(Fragment for `@import` from any FastAPI project's CLAUDE.md. Pairs well with `python-package.md`.)

## Stack

- FastAPI 0.110+ on Python 3.11+
- Pydantic v2 for request/response models
- SQLAlchemy 2.x async or SQLModel for ORM (specify per project)
- Alembic for migrations
- pytest + httpx for testing
- uvicorn (dev) and gunicorn+uvicorn (prod), or container orchestrator

## Layout

```
src/<app>/
  main.py              FastAPI app instance + middleware
  routes/              one router per resource
    users.py
    items.py
  models/              Pydantic models (request/response)
  schemas/             SQLAlchemy / SQLModel ORM models
  services/            business logic, no FastAPI imports
  deps.py              shared Depends() functions
  config.py            pydantic-settings env loading
tests/
alembic/
```

## Conventions

- One router per resource. Mount in `main.py` with consistent prefix and tags.
- Request and response models are SEPARATE Pydantic classes. Don't reuse the ORM model for both.
- Business logic in `services/` — pure functions, no FastAPI dependencies. Routes just orchestrate.
- Use `Depends()` for shared concerns (auth, db session, current user). Don't pass them as args.
- Async all the way OR sync all the way. Don't mix without a reason.

## Auth

- JWT validation in a `Depends()` that returns the user, not just the token.
- Don't put auth logic in routes. Put it in `deps.py` so it's testable and reusable.
- For service-to-service, use API keys with a separate dependency.

## Testing

- pytest with `httpx.AsyncClient` against the FastAPI app instance (not over HTTP).
- Use `app.dependency_overrides` to swap in test fakes.
- One conftest.py per test directory level.
- Test the routes for shape; test the services for logic.

## Common gotchas

- Pydantic v2 `model_dump()` not `.dict()`. `model_validate()` not `parse_obj()`.
- Async DB sessions: one per request, via Depends. Never share across requests.
- BackgroundTasks runs AFTER response is sent — fine for fire-and-forget, NOT for things the user needs.
- CORS middleware order matters: add CORSMiddleware BEFORE the routes are mounted.

## Ask before acting

- Schema changes that need a migration
- Adding a new dependency for HTTP, auth, or DB layers
- Changing the auth strategy
