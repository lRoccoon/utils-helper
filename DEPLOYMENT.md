# Deployment Guide

This guide covers deploying Utils Helper to various platforms.

## Table of Contents

- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)

## Docker Deployment

### Using Docker Compose (Recommended)

The easiest way to deploy is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/lRoccoon/utils-helper.git
cd utils-helper

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Using Pre-built Images

Pull and run pre-built images from GitHub Container Registry:

```bash
# Pull images
docker pull ghcr.io/lroccoon/utils-helper-backend:latest
docker pull ghcr.io/lroccoon/utils-helper-frontend:latest

# Run backend
docker run -d \
  --name utils-helper-backend \
  -p 8080:8080 \
  ghcr.io/lroccoon/utils-helper-backend:latest

# Run frontend
docker run -d \
  --name utils-helper-frontend \
  -p 3000:3000 \
  -e BACKEND_URL=http://localhost:8080 \
  ghcr.io/lroccoon/utils-helper-frontend:latest
```

### Building Custom Images

Build your own images:

```bash
# Build backend
docker build -f Dockerfile.backend -t utils-helper-backend:custom .

# Build frontend
docker build -f Dockerfile.frontend -t utils-helper-frontend:custom .

# Run with custom images
docker run -d -p 8080:8080 utils-helper-backend:custom
docker run -d -p 3000:3000 -e BACKEND_URL=http://localhost:8080 utils-helper-frontend:custom
```

## Cloud Deployment

### Deploy to AWS ECS

1. Create ECR repositories:
```bash
aws ecr create-repository --repository-name utils-helper-backend
aws ecr create-repository --repository-name utils-helper-frontend
```

2. Build and push images:
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag utils-helper-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/utils-helper-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/utils-helper-backend:latest

docker tag utils-helper-frontend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/utils-helper-frontend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/utils-helper-frontend:latest
```

3. Create ECS task definition and service (see AWS ECS documentation)

### Deploy to Google Cloud Run

```bash
# Backend
gcloud run deploy utils-helper-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Frontend
gcloud run deploy utils-helper-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars BACKEND_URL=https://YOUR_BACKEND_URL
```

### Deploy to Kubernetes

Create deployments and services:

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: utils-helper-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: utils-helper-backend
  template:
    metadata:
      labels:
        app: utils-helper-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/lroccoon/utils-helper-backend:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: utils-helper-backend
spec:
  selector:
    app: utils-helper-backend
  ports:
  - port: 8080
    targetPort: 8080
  type: LoadBalancer
```

Apply:
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

## Manual Deployment

### Backend (Go)

1. Build the binary:
```bash
cd backend
go build -o bin/server ./cmd/server
```

2. Run the server:
```bash
PORT=8080 ./bin/server
```

3. For production, use a process manager like systemd:

```ini
# /etc/systemd/system/utils-helper-backend.service
[Unit]
Description=Utils Helper Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/utils-helper/backend
ExecStart=/opt/utils-helper/backend/bin/server
Restart=always
Environment="PORT=8080"

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable utils-helper-backend
sudo systemctl start utils-helper-backend
```

### Frontend (Next.js)

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. Start the production server:
```bash
npm start
```

3. For production, use PM2:
```bash
npm install -g pm2
pm2 start npm --name "utils-helper-frontend" -- start
pm2 save
pm2 startup
```

## Environment Variables

### Backend

- `PORT`: Server port (default: 8080)

### Frontend

- `BACKEND_URL`: Backend API URL (default: http://localhost:8080)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Frontend port (default: 3000)

## SSL/TLS Configuration

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Monitoring and Logging

### Docker Compose Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Application Logs

Backend logs are written to stdout/stderr. Configure your logging solution accordingly:

- CloudWatch Logs (AWS)
- Stackdriver Logging (GCP)
- Azure Monitor (Azure)
- ELK Stack (self-hosted)

## Scaling

### Horizontal Scaling

For high traffic, scale horizontally:

```bash
# Docker Compose
docker-compose up -d --scale backend=3 --scale frontend=2

# Kubernetes
kubectl scale deployment utils-helper-backend --replicas=3
kubectl scale deployment utils-helper-frontend --replicas=2
```

### Load Balancing

Use a load balancer in front of your instances:
- AWS ALB/NLB
- Google Cloud Load Balancing
- Nginx
- HAProxy

## Backup and Recovery

### Database-less Design

This application doesn't use a database, so no data backup is needed. All data is static (holiday information) or computed on-demand.

### Configuration Backup

Backup your:
- Environment variables
- SSL certificates
- Nginx/reverse proxy configuration
- Docker/Kubernetes manifests

## Troubleshooting

### Backend not starting

1. Check if port 8080 is available:
```bash
netstat -tulpn | grep 8080
```

2. Check logs:
```bash
docker logs utils-helper-backend
```

### Frontend can't connect to backend

1. Verify BACKEND_URL environment variable
2. Check network connectivity
3. Verify CORS settings in backend

### Docker build fails

1. Clear Docker cache:
```bash
docker system prune -a
```

2. Build with no cache:
```bash
docker build --no-cache -f Dockerfile.backend .
```

## Security Considerations

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Rate Limiting**: Implement rate limiting on API endpoints
3. **CORS**: Configure appropriate CORS settings
4. **Updates**: Keep dependencies updated
5. **Secrets**: Never commit secrets to version control
6. **Firewall**: Configure firewall rules appropriately

## Performance Optimization

1. **CDN**: Use a CDN for static assets
2. **Caching**: Implement caching for API responses
3. **Compression**: Enable gzip compression
4. **Connection Pooling**: Use connection pooling for database connections (if added)
5. **Monitoring**: Set up performance monitoring

## Support

For deployment issues:
1. Check the logs
2. Review this guide
3. Open an issue on GitHub
4. Check the troubleshooting section
