# SureGuard AI Deployment Guide

This comprehensive guide covers all deployment scenarios for SureGuard AI, from development to enterprise production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployments](#cloud-deployments)
- [Monitoring Setup](#monitoring-setup)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 4 cores | 8+ cores |
| **RAM** | 8 GB | 16+ GB |
| **Storage** | 50 GB | 100+ GB SSD |
| **Network** | 100 Mbps | 1 Gbps |

### Software Dependencies

\`\`\`bash
# Node.js and npm
node --version  # v20.0.0+
npm --version   # v10.0.0+

# Python
python --version  # v3.11.0+
pip --version     # v23.0.0+

# Docker
docker --version         # v24.0.0+
docker-compose --version # v2.20.0+

# Kubernetes (for K8s deployment)
kubectl version --client # v1.28.0+
helm version            # v3.12.0+
\`\`\`

## ⚙️ Environment Configuration

### Environment Files

Create environment files for different stages:

\`\`\`bash
# Development
cp .env.example .env.development

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.production
\`\`\`

### Core Environment Variables

\`\`\`env
# Application Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/sureguard
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Cache Configuration
REDIS_URL=redis://redis:6379
REDIS_CLUSTER_NODES=redis-1:6379,redis-2:6379,redis-3:6379
CACHE_TTL=300

# Security Configuration
JWT_SECRET=your-256-bit-secret-key-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-character-encryption-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# External API Keys
VIRUSTOTAL_API_KEY=your-virustotal-api-key
SHODAN_API_KEY=your-shodan-api-key
ABUSEIPDB_API_KEY=your-abuseipdb-api-key
OPENAI_API_KEY=your-openai-api-key

# Notification Services
SENDGRID_API_KEY=your-sendgrid-api-key
SLACK_WEBHOOK_URL=your-slack-webhook-url
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Cloud Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=sureguard-storage

# Monitoring
PROMETHEUS_ENABLED=true
JAEGER_ENABLED=true
LOG_LEVEL=info
METRICS_PORT=9090
\`\`\`

## 🏠 Local Development

### Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/your-org/sureguard-ai.git
cd sureguard-ai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development
# Edit .env.development with your settings

# Start development environment
npm run dev:setup
npm run dev
\`\`\`

### Development with Docker

\`\`\`bash
# Start development stack
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development stack
docker-compose -f docker-compose.dev.yml down
\`\`\`

### Service-by-Service Development

\`\`\`bash
# Start only required infrastructure
docker-compose up -d postgres redis

# Start individual services
npm run dev:main        # Main application (port 3000)
npm run dev:auth        # Auth service (port 3001)
npm run dev:ml          # ML service (port 8080)
npm run dev:threats     # Threat detection (port 3002)
\`\`\`

## 🐳 Docker Deployment

### Production Docker Compose

\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - sureguard-app
    restart: unless-stopped

  # Main Application
  sureguard-app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  # Database with replication
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: sureguard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-database.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G

  # Redis Cluster
  redis-master:
    image: redis:7-alpine
    command: redis-server --appendonly yes --replica-read-only no
    volumes:
      - redis_master_data:/data
    restart: unless-stopped

  redis-replica:
    image: redis:7-alpine
    command: redis-server --appendonly yes --replicaof redis-master 6379
    depends_on:
      - redis-master
    restart: unless-stopped
    deploy:
      replicas: 2

volumes:
  postgres_data:
  redis_master_data:
\`\`\`

### Deployment Commands

\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale sureguard-app=5

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres sureguard > backup.sql
\`\`\`

## ☸️ Kubernetes Deployment

### Cluster Requirements

\`\`\`bash
# Minimum cluster specifications
# - 3 worker nodes
# - 4 CPU cores per node
# - 8 GB RAM per node
# - 100 GB storage per node
\`\`\`

### Namespace and RBAC

\`\`\`yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sureguard
  labels:
    name: sureguard
    istio-injection: enabled
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sureguard-sa
  namespace: sureguard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: sureguard-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: sureguard-binding
subjects:
- kind: ServiceAccount
  name: sureguard-sa
  namespace: sureguard
roleRef:
  kind: ClusterRole
  name: sureguard-role
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ConfigMaps and Secrets

\`\`\`bash
# Create secrets from environment file
kubectl create secret generic sureguard-secrets \
  --from-env-file=.env.production \
  --namespace=sureguard

# Create TLS secret
kubectl create secret tls sureguard-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  --namespace=sureguard
\`\`\`

### Deployment Steps

\`\`\`bash
# 1. Create namespace and RBAC
kubectl apply -f k8s/namespace.yaml

# 2. Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 3. Deploy databases
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/clickhouse.yaml

# 4. Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n sureguard --timeout=300s

# 5. Deploy services
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/ml-service.yaml
kubectl apply -f k8s/threat-detection-service.yaml
kubectl apply -f k8s/analytics-service.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/notification-service.yaml

# 6. Deploy main application
kubectl apply -f k8s/main-app.yaml

# 7. Deploy ingress
kubectl apply -f k8s/ingress.yaml

# 8. Verify deployment
kubectl get pods -n sureguard
kubectl get services -n sureguard
\`\`\`

### Horizontal Pod Autoscaler

\`\`\`yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sureguard-app-hpa
  namespace: sureguard
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sureguard-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

## ☁️ Cloud Deployments

### AWS EKS Deployment

\`\`\`bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name sureguard-cluster \
  --region us-west-2 \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10 \
  --node-type m5.xlarge \
  --with-oidc \
  --managed

# Install AWS Load Balancer Controller
eksctl utils associate-iam-oidc-provider --region=us-west-2 --cluster=sureguard-cluster --approve

# Deploy application
kubectl apply -f k8s/
\`\`\`

### Google GKE Deployment

\`\`\`bash
# Create GKE cluster
gcloud container clusters create sureguard-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-4 \
  --zone=us-central1-a \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=10 \
  --enable-autorepair \
  --enable-autoupgrade

# Get credentials
gcloud container clusters get-credentials sureguard-cluster --zone=us-central1-a

# Deploy application
kubectl apply -f k8s/
\`\`\`

### Azure AKS Deployment

\`\`\`bash
# Create resource group
az group create --name sureguard-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group sureguard-rg \
  --name sureguard-cluster \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group sureguard-rg --name sureguard-cluster

# Deploy application
kubectl apply -f k8s/
\`\`\`

## 📊 Monitoring Setup

### Prometheus and Grafana

\`\`\`bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring/prometheus-values.yaml

# Install Grafana
helm install grafana grafana/grafana \
  --namespace monitoring \
  --values monitoring/grafana-values.yaml

# Get Grafana admin password
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode
\`\`\`

### Custom Dashboards

\`\`\`bash
# Import SureGuard dashboards
kubectl apply -f monitoring/grafana/dashboards/
\`\`\`

### Alerting Rules

\`\`\`yaml
# monitoring/alerts/sureguard-alerts.yaml
groups:
- name: sureguard.rules
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate detected
      description: "Error rate is {{ $value }} errors per second"

  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: High memory usage
      description: "Memory usage is above 90%"
\`\`\`

## 🔒 Security Configuration

### TLS/SSL Setup

\`\`\`bash
# Generate self-signed certificate (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=sureguard.local"

# Create TLS secret
kubectl create secret tls sureguard-tls \
  --cert=tls.crt --key=tls.key \
  --namespace=sureguard
\`\`\`

### Network Policies

\`\`\`yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sureguard-network-policy
  namespace: sureguard
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: sureguard
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
  - to:
    - namespaceSelector:
        matchLabels:
          name: sureguard
\`\`\`

### Pod Security Standards

\`\`\`yaml
# k8s/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sureguard-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
\`\`\`

## 🔧 Troubleshooting

### Common Issues

#### Service Discovery Issues

\`\`\`bash
# Check DNS resolution
kubectl exec -it pod-name -- nslookup service-name

# Check service endpoints
kubectl get endpoints -n sureguard

# Test service connectivity
kubectl exec -it pod-name -- curl http://service-name:port/health
\`\`\`

#### Database Connection Issues

\`\`\`bash
# Check database pod status
kubectl get pods -l app=postgres -n sureguard

# Check database logs
kubectl logs -l app=postgres -n sureguard

# Test database connection
kubectl exec -it postgres-pod -- psql -U postgres -d sureguard -c "SELECT 1;"
\`\`\`

#### Memory and CPU Issues

\`\`\`bash
# Check resource usage
kubectl top pods -n sureguard
kubectl top nodes

# Check resource limits
kubectl describe pod pod-name -n sureguard

# Scale resources
kubectl patch deployment deployment-name -n sureguard -p '{"spec":{"template":{"spec":{"containers":[{"name":"container-name","resources":{"limits":{"memory":"2Gi","cpu":"1000m"}}}]}}}}'
\`\`\`

### Health Checks

\`\`\`bash
# Application health
curl -f http://localhost:3000/health

# Service health
kubectl get pods -n sureguard
kubectl describe pod pod-name -n sureguard

# Database health
kubectl exec -it postgres-pod -n sureguard -- pg_isready

# Redis health
kubectl exec -it redis-pod -n sureguard -- redis-cli ping
\`\`\`

### Log Analysis

\`\`\`bash
# Application logs
kubectl logs -f deployment/sureguard-app -n sureguard

# All service logs
kubectl logs -f -l app=sureguard -n sureguard --max-log-requests=10

# Error logs only
kubectl logs -f deployment/sureguard-app -n sureguard | grep ERROR
\`\`\`

### Performance Tuning

\`\`\`bash
# Database optimization
kubectl exec -it postgres-pod -n sureguard -- psql -U postgres -d sureguard -c "
  SELECT schemaname,tablename,attname,n_distinct,correlation 
  FROM pg_stats 
  WHERE schemaname = 'public' 
  ORDER BY n_distinct DESC;
"

# Redis optimization
kubectl exec -it redis-pod -n sureguard -- redis-cli info memory

# Application metrics
curl http://localhost:3000/metrics
\`\`\`

## 📋 Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Secrets created and secured
- [ ] Database migrations tested
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security policies applied

### Post-deployment

- [ ] Health checks passing
- [ ] Monitoring dashboards working
- [ ] Alerts configured
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Team notified

### Rollback Plan

\`\`\`bash
# Kubernetes rollback
kubectl rollout undo deployment/sureguard-app -n sureguard

# Docker Compose rollback
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --scale sureguard-app=0
# Deploy previous version
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

---

For additional support, contact our DevOps team at devops@sureguard.ai or create an issue in our GitHub repository.

