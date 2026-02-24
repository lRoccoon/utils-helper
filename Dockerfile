# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend with embedded frontend
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app

# Copy backend source
COPY backend/go.mod backend/go.sum* ./
RUN go mod download

COPY backend/ ./

# Copy built frontend static files into the embed location
COPY --from=frontend-builder /app/frontend/out ./internal/static/dist

# Build the Go binary with embedded files
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Stage 3: Final minimal image
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy the server binary (with embedded frontend)
COPY --from=backend-builder /server /app/server

# Expose only backend port (serves both API and frontend)
EXPOSE 8080

CMD ["/app/server"]
