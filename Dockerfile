# Backend Dockerfile
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/go.mod backend/go.sum* ./
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Frontend Dockerfile
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy backend binary
COPY --from=backend-builder /app/server /app/server

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend-builder /app/frontend/node_modules /app/frontend/node_modules

# Expose ports
EXPOSE 8080 3000

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/frontend && npm start &' >> /app/start.sh && \
    echo '/app/server' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
