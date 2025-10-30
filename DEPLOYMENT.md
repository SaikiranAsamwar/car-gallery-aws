# 🚀 AWS Cloud Deployment Guide

This guide walks you through deploying the Car Gallery application to AWS using RDS, S3, Docker, and Kubernetes.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Users/Web     │    │  Application     │    │   Database      │
│                 │    │                  │    │                 │
│ S3 + CloudFront │◄──►│ EKS/Kubernetes   │◄──►│ RDS MySQL       │
│ (Frontend)      │    │ (Backend API)    │    │ (Data Storage)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ ECR Repository   │
                       │ (Docker Images)  │
                       └──────────────────┘
```

## 📋 Prerequisites

### Required Tools
- AWS CLI v2
- Docker Desktop
- kubectl
- Terraform (>= 1.0)
- Git

### AWS Setup
- AWS Account with appropriate permissions
- AWS CLI configured with credentials
- EKS cluster (or create one)

## 🔧 Step-by-Step Deployment

### 1. Infrastructure Setup (Terraform)

```bash
# Navigate to terraform directory
cd deployment/terraform

# Initialize Terraform
terraform init

# Plan the infrastructure
terraform plan

# Apply the infrastructure (will create RDS, ECR, S3, VPC, etc.)
terraform apply
```

**What gets created:**
- VPC with public/private subnets
- RDS MySQL database
- ECR repository for Docker images
- S3 bucket for frontend hosting
- Security groups and networking

### 2. Database Setup

```bash
# Get RDS endpoint from Terraform output
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

# Connect to RDS and run setup script
mysql -h $RDS_ENDPOINT -u admin -p car_expo < ../rds-setup.sql
```

### 3. Backend Deployment (Docker + Kubernetes)

```bash
# Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-ecr-url>

cd ../../Backend
docker build -t car-gallery-backend .
docker tag car-gallery-backend:latest <your-ecr-url>:latest
docker push <your-ecr-url>:latest

# Deploy to Kubernetes
kubectl apply -f ../deployment/kubernetes/
```

### 4. Frontend Deployment (S3)

```bash
# Update API endpoint in frontend
# Edit Frontend/script.js and update API_BASE to your ALB endpoint

# Upload to S3
aws s3 sync Frontend/ s3://<your-s3-bucket> --delete
```

### 5. Automated Deployment

For easier deployment, use the provided scripts:

**Linux/Mac:**
```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

**Windows:**
```cmd
deployment\deploy.bat
```

## 🐳 Local Testing with Docker Compose

Test the full stack locally before deploying:

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000/api
# MySQL: localhost:3306
```

## 🔐 Security Configurations

### Environment Variables
Create `Backend/.env.production`:
```bash
DB_HOST=your-rds-endpoint
DB_USER=admin  
DB_PASS=your-secure-password
DB_NAME=car_expo
NODE_ENV=production
PORT=4000
```

### Kubernetes Secrets
Update `deployment/kubernetes/secrets-configmap.yaml`:
```bash
# Encode your values
echo -n 'your-rds-endpoint' | base64
echo -n 'your-password' | base64
```

## 📊 Monitoring and Health Checks

### Application Health Checks
- Backend: `GET /api/types`
- Frontend: S3 website endpoint
- Database: MySQL connection test

### Kubernetes Monitoring
```bash
# Check pod status
kubectl get pods -n car-gallery

# View logs
kubectl logs -f deployment/car-gallery-backend -n car-gallery

# Check service
kubectl get svc -n car-gallery
```

## 🌐 DNS and SSL Configuration

### Route 53 Setup
1. Create hosted zone for your domain
2. Point domain to ALB endpoint
3. Configure SSL certificate via ACM

### CloudFront Distribution (Optional)
```bash
# Create CloudFront distribution for S3
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## 🚦 Deployment Checklist

- [ ] AWS credentials configured
- [ ] Terraform infrastructure applied
- [ ] RDS database created and populated
- [ ] ECR repository created
- [ ] Docker image built and pushed
- [ ] Kubernetes cluster ready
- [ ] Secrets and ConfigMaps applied
- [ ] Backend deployed to Kubernetes
- [ ] Frontend uploaded to S3
- [ ] Domain and SSL configured
- [ ] Health checks passing

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check RDS endpoint in secrets
- Verify security group allows port 3306
- Confirm database credentials

**Docker Build Fails:**
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Ensure proper file permissions

**Kubernetes Deployment Issues:**
- Check pod logs: `kubectl logs <pod-name> -n car-gallery`
- Verify secrets are properly encoded
- Check resource limits and requests

**S3 Upload Issues:**
- Verify bucket permissions
- Check AWS CLI credentials
- Ensure bucket policy allows public read

### Useful Commands

```bash
# Check AWS resources
aws rds describe-db-instances
aws ecr describe-repositories
aws s3 ls

# Kubernetes debugging
kubectl describe pod <pod-name> -n car-gallery
kubectl get events -n car-gallery
kubectl exec -it <pod-name> -n car-gallery -- /bin/sh

# Clean up resources
terraform destroy
kubectl delete namespace car-gallery
```

## 💰 Cost Optimization

### AWS Resources Costs (Estimated)
- RDS db.t3.micro: ~$12/month
- S3 storage: ~$1/month for 50GB
- ECR repository: ~$1/month
- EKS cluster: ~$70/month
- Data transfer: Variable

### Cost Reduction Tips
- Use spot instances for EKS nodes
- Enable S3 Intelligent Tiering
- Set up CloudWatch billing alerts
- Use RDS Reserved Instances for production

## 🔄 CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Deploy Car Gallery
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to AWS
      run: ./deployment/deploy.sh
```

## 📈 Scaling Considerations

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: car-gallery-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: car-gallery-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling
- Use RDS Read Replicas for read-heavy workloads
- Consider Aurora Serverless for variable traffic
- Implement connection pooling in application

## 📞 Support

For deployment issues:
1. Check application logs
2. Review AWS CloudWatch metrics
3. Verify Kubernetes cluster status
4. Test connectivity between components

---

**🎉 Congratulations!** Your Car Gallery application is now running on AWS with enterprise-grade infrastructure!