.PHONY: help build test test-coverage run-backend run-frontend docker-build docker-up docker-down clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Backend targets
backend-deps: ## Install backend dependencies
	cd backend && go mod download

backend-test: ## Run backend tests
	cd backend && go test -v -race ./...

backend-test-coverage: ## Run backend tests with coverage
	cd backend && go test -v -race -coverprofile=coverage.out -covermode=atomic ./...
	cd backend && go tool cover -func=coverage.out

backend-build: ## Build backend binary
	cd backend && go build -o bin/server ./cmd/server

backend-run: ## Run backend server
	cd backend && go run ./cmd/server/main.go

# Frontend targets
frontend-deps: ## Install frontend dependencies
	cd frontend && npm install

frontend-test: ## Run frontend tests
	cd frontend && npm test

frontend-test-coverage: ## Run frontend tests with coverage
	cd frontend && npm run test:coverage

frontend-build: ## Build frontend
	cd frontend && npm run build

frontend-dev: ## Run frontend in development mode
	cd frontend && npm run dev

frontend-lint: ## Lint frontend code
	cd frontend && npm run lint

# Docker targets
docker-build: ## Build Docker images
	docker build -f Dockerfile.backend -t utils-helper-backend:latest .
	docker build -f Dockerfile.frontend -t utils-helper-frontend:latest .

docker-up: ## Start services with docker-compose
	docker-compose up -d

docker-down: ## Stop services with docker-compose
	docker-compose down

docker-logs: ## View docker-compose logs
	docker-compose logs -f

# Combined targets
deps: backend-deps frontend-deps ## Install all dependencies

test: backend-test frontend-test ## Run all tests

test-coverage: backend-test-coverage frontend-test-coverage ## Run all tests with coverage

build: backend-build frontend-build ## Build all components

run: ## Run both backend and frontend in development
	@echo "Starting backend in background..."
	@cd backend && go run ./cmd/server/main.go &
	@echo "Starting frontend..."
	@cd frontend && npm run dev

clean: ## Clean build artifacts
	rm -rf backend/bin
	rm -rf backend/coverage.out
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf frontend/coverage

.DEFAULT_GOAL := help
