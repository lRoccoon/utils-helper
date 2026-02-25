# Contributing to Utils Helper

Thank you for your interest in contributing to Utils Helper! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and considerate of others. We're all here to build something useful together.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/utils-helper.git`
3. Create a feature branch: `git checkout -b feature/my-new-feature`
4. Make your changes
5. Run tests and ensure coverage stays above 90%
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/my-new-feature`
8. Submit a Pull Request

## Development Setup

### Prerequisites

- Go 1.21 or higher
- Node.js 20 or higher
- Docker (optional, for containerized development)

### Backend Development

```bash
cd backend
go mod download
go run cmd/server/main.go
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Testing Requirements

### Test-Driven Development (TDD)

We follow TDD practices:

1. Write tests first (they should fail)
2. Implement the minimal code to pass the tests
3. Refactor while keeping tests green
4. Ensure coverage remains above 90%

### Running Tests

**Backend:**
```bash
cd backend
go test -v -race -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
```

**Frontend:**
```bash
cd frontend
npm run test
npm run test:coverage
```

### Coverage Requirements

- **Minimum**: 90% line coverage
- **Goal**: 95%+ coverage
- CI will fail if coverage drops below 90%

## Code Style

### Go

- Follow standard Go conventions
- Use `gofmt` to format code
- Run `go vet` to check for issues
- Use meaningful variable and function names

### TypeScript/React

- Follow the existing code style
- Use meaningful component and variable names
- Prefer functional components with hooks
- Keep components small and focused

### Formatting

Backend:
```bash
cd backend
gofmt -w .
go vet ./...
```

Frontend:
```bash
cd frontend
npm run lint
```

## Commit Messages

Write clear, descriptive commit messages:

```
feat: Add JSON to Go struct conversion

- Implement parser for JSON schema
- Generate Go struct with proper tags
- Add comprehensive test coverage
```

Format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

## Pull Request Process

1. **Update Documentation**: If you're adding features, update README.md
2. **Add Tests**: All new code must have tests
3. **Pass CI**: Ensure all CI checks pass
4. **Coverage**: Maintain 90%+ test coverage
5. **Review**: Wait for review from maintainers
6. **Respond**: Address review feedback promptly

### PR Checklist

- [ ] Tests added and passing
- [ ] Coverage at or above 90%
- [ ] Documentation updated
- [ ] Code follows project style
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] CI checks pass

## Adding New Features

### Backend API Endpoints

1. Add route in `backend/internal/api/routes.go`
2. Create handler in `backend/internal/api/handler/`
3. Implement service logic in `backend/internal/service/`
4. Add comprehensive tests
5. Update API documentation in README.md

### Frontend Tools

1. Create page in `frontend/app/[tool-name]/page.tsx`
2. Add components in `frontend/components/`
3. Update `CommandMenu.tsx` to include new tool
4. Add tests for components
5. Update README.md with tool description

## Testing Guidelines

### Unit Tests

- Test individual functions and methods
- Mock external dependencies
- Cover edge cases and error conditions
- Use table-driven tests where appropriate (Go)

### Integration Tests

- Test API endpoints end-to-end
- Test component interactions
- Verify data flow through the system

### Coverage Tips

- Focus on meaningful coverage, not just percentage
- Test error paths and edge cases
- Don't test framework code
- Mock external services

## Documentation

- Keep README.md up to date
- Document API changes
- Add inline comments for complex logic
- Update AGENTS.md if changing CI/CD

## Questions?

- Open an issue with the `question` label
- Check existing issues and PRs
- Read the documentation in README.md

## Recognition

Contributors will be recognized in release notes and may be added to a CONTRIBUTORS file.

Thank you for contributing to Utils Helper!
