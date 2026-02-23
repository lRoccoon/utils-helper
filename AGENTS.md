# AGENTS.md

This document describes the AI agents and automation used in the Utils Helper project.

## Claude Code Agent

This project was initially scaffolded and developed with the help of Claude Code, an AI-powered development assistant. The agent helped with:

- **Initial Project Structure**: Setting up the Next.js frontend and Go backend architecture
- **API Development**: Implementing IP address and holiday query APIs with proper error handling
- **Frontend Components**: Creating the command menu (Cmd+K) and base application structure
- **Testing Infrastructure**: Setting up Jest for frontend and Go testing for backend with 90%+ coverage goals
- **Docker Configuration**: Multi-architecture Docker builds for amd64 and arm64
- **CI/CD Pipeline**: GitHub Actions workflows for automated testing and deployment

## GitHub Actions Agents

### Testing Agents

1. **Backend Test Agent** (`.github/workflows/backend-test.yml`)
   - Runs Go tests with race detection
   - Validates 90% code coverage requirement
   - Uploads coverage reports to Codecov

2. **Frontend Test Agent** (`.github/workflows/frontend-test.yml`)
   - Runs Jest tests with coverage
   - Executes ESLint for code quality
   - Validates 90% code coverage requirement

### Build and Deployment Agents

1. **Docker Build Agent** (`.github/workflows/docker-build.yml`)
   - Builds multi-architecture Docker images (amd64, arm64)
   - Pushes images to GitHub Container Registry
   - Creates tagged releases automatically
   - Caches build layers for faster builds

## Development Workflow

### TDD (Test-Driven Development) Approach

The project follows a strict TDD methodology:

1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor while maintaining test coverage
4. Ensure 90%+ code coverage at all times

### Continuous Integration

Every push and pull request triggers:

1. **Automated Testing**: Both frontend and backend tests run in parallel
2. **Coverage Validation**: Fails if coverage drops below 90%
3. **Docker Build**: Validates that images can be built successfully
4. **Multi-arch Support**: Ensures compatibility with both amd64 and arm64

### Continuous Deployment

On main branch pushes:

1. Docker images are built for both architectures
2. Images are tagged with:
   - Branch name
   - Git SHA
   - Semantic version (if tagged)
3. Images are pushed to GitHub Container Registry
4. Available for deployment via `docker pull`

## Future Agent Enhancements

Potential areas for additional automation:

1. **Dependency Update Agent**: Automatically create PRs for dependency updates
2. **Documentation Agent**: Auto-generate API documentation from code
3. **Performance Testing Agent**: Automated load and performance testing
4. **Security Scanning Agent**: Automated vulnerability scanning
5. **Localization Agent**: Automated translation and i18n updates

## Contributing with Agents

When contributing to this project:

1. Ensure all tests pass locally before pushing
2. Maintain the 90% coverage requirement
3. Let CI agents validate your changes
4. Review agent feedback in PR checks
5. Use Claude Code or similar AI assistants for:
   - Code generation and refactoring
   - Test case generation
   - Documentation updates
   - Bug fixing suggestions

## Agent Configuration

### Required Secrets

For GitHub Actions agents to work properly, ensure these secrets are configured:

- `GITHUB_TOKEN`: Automatically provided by GitHub
- `CODECOV_TOKEN`: (Optional) For Codecov integration

### Environment Variables

Backend:
- `PORT`: Server port (default: 8080)

Frontend:
- `BACKEND_URL`: Backend API URL
- `NODE_ENV`: Environment (development/production)

## Monitoring Agent Performance

Track agent effectiveness through:

1. **Build Times**: Monitor CI/CD pipeline duration
2. **Test Success Rate**: Track test pass/fail ratios
3. **Coverage Trends**: Ensure coverage stays above 90%
4. **Deployment Success**: Monitor Docker build and push success rates

## Support

For issues with automation or agents:

1. Check GitHub Actions logs
2. Review agent configuration files
3. Open an issue with `[agent]` prefix
4. Provide relevant logs and error messages
