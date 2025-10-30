#!/bin/bash

# Car Gallery AWS Deployment Script
set -e

# Configuration
PROJECT_NAME="car-gallery"
AWS_REGION="us-east-1"
ECR_REPOSITORY_NAME="car-gallery-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Car Gallery AWS Deployment${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}📋 Checking prerequisites...${NC}"
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    print_status "All prerequisites are installed"
}

# Build and push Docker image
build_and_push_image() {
    echo -e "${BLUE}🐳 Building and pushing Docker image...${NC}"
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URL
    
    # Build image
    cd Backend
    docker build -t $PROJECT_NAME-backend .
    
    # Tag and push image
    docker tag $PROJECT_NAME-backend:latest $ECR_REPOSITORY_URL:latest
    docker push $ECR_REPOSITORY_URL:latest
    
    print_status "Docker image pushed successfully"
    cd ..
}

# Deploy to Kubernetes
deploy_to_k8s() {
    echo -e "${BLUE}☸️ Deploying to Kubernetes...${NC}"
    
    # Apply namespace and secrets
    kubectl apply -f deployment/kubernetes/secrets-configmap.yaml
    
    # Apply backend deployment
    envsubst < deployment/kubernetes/backend-deployment.yaml | kubectl apply -f -
    
    # Wait for deployment to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/car-gallery-backend -n car-gallery
    
    print_status "Kubernetes deployment completed"
}

# Upload frontend to S3
upload_frontend() {
    echo -e "${BLUE}📤 Uploading frontend to S3...${NC}"
    
    # Update API endpoint in frontend
    sed -i "s|const API_BASE = .*|const API_BASE = 'https://car-gallery.your-domain.com/api';|g" Frontend/script.js
    
    # Upload to S3
    aws s3 sync Frontend/ s3://$S3_BUCKET_NAME --delete
    
    print_status "Frontend uploaded to S3"
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    # Get infrastructure outputs
    if [ -f "deployment/terraform/terraform.tfstate" ]; then
        ECR_REPOSITORY_URL=$(cd deployment/terraform && terraform output -raw ecr_repository_url)
        S3_BUCKET_NAME=$(cd deployment/terraform && terraform output -raw s3_bucket_name)
        RDS_ENDPOINT=$(cd deployment/terraform && terraform output -raw rds_endpoint)
    else
        print_error "Terraform state not found. Please run terraform apply first."
        exit 1
    fi
    
    check_prerequisites
    build_and_push_image
    deploy_to_k8s
    upload_frontend
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}📊 Deployment Information:${NC}"
    echo -e "ECR Repository: $ECR_REPOSITORY_URL"
    echo -e "S3 Bucket: $S3_BUCKET_NAME"
    echo -e "RDS Endpoint: $RDS_ENDPOINT"
}

# Run main function
main "$@"