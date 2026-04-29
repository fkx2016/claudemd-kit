# Python package conventions

(Fragment for `@import` from any modern Python project's CLAUDE.md.)

## Stack

- Python 3.11+
- `pyproject.toml` (PEP 621), no `setup.py`
- `uv` for environment management (preferred) or `poetry`
- `ruff` for linting + formatting (no separate black / flake8 / isort)
- `mypy` strict mode for type checking
- `pytest` with `pytest-cov`

## File layout

```
src/<package_name>/
tests/
pyproject.toml
README.md
```

Use src-layout, not flat. Tests outside the package.

## Conventions

- Type hints on all public functions. Untyped private internals OK if obvious.
- Use `pathlib.Path`, not raw strings, for filesystem paths.
- Use `logging`, not `print`, for runtime output. Configure once at the entry point.
- Async only when there's a real I/O reason. Don't async-poison sync code.
- Prefer `dataclasses` or `pydantic` over dicts for structured data.

## Testing

- pytest discovers tests in `tests/`. No nose, no unittest classes.
- Fixtures in `conftest.py` at the appropriate scope.
- Mock with `pytest-mock` or `unittest.mock`.
- Coverage target: 80%+ for new code, but test behavior, not lines.

## Common commands

- Install for dev: `uv sync` or `poetry install`
- Run tests: `uv run pytest`
- Lint: `ruff check .`
- Format: `ruff format .`
- Type check: `mypy src/`

## Ask before acting

- Adding a new dependency
- Changing the public API of an exported module
- Modifying CI configuration
