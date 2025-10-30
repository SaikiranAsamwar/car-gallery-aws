@echo off
REM Car Gallery AWS Deployment Script for Windows
echo 🚀 Starting Car Gallery AWS Deployment

REM Configuration
set PROJECT_NAME=car-gallery
set AWS_REGION=us-east-1
set ECR_REPOSITORY_NAME=car-gallery-backend

echo 📋 Checking prerequisites...

REM Check AWS CLI
aws --version >nul 2>&1
if errorlevel 1 (
    echo ✗ AWS CLI is not installed
    exit /b 1
)

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker is not installed
    exit /b 1
)

REM Check kubectl
kubectl version --client >nul 2>&1
if errorlevel 1 (
    echo ✗ kubectl is not installed
    exit /b 1
)

echo ✓ All prerequisites are installed

echo 🐳 Building and pushing Docker image...

REM Get Terraform outputs
cd deployment\terraform
for /f "tokens=*" %%i in ('terraform output -raw ecr_repository_url') do set ECR_REPOSITORY_URL=%%i
for /f "tokens=*" %%i in ('terraform output -raw s3_bucket_name') do set S3_BUCKET_NAME=%%i
cd ..\..

REM ECR Login
aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %ECR_REPOSITORY_URL%

REM Build and push image
cd Backend
docker build -t %PROJECT_NAME%-backend .
docker tag %PROJECT_NAME%-backend:latest %ECR_REPOSITORY_URL%:latest
docker push %ECR_REPOSITORY_URL%:latest
cd ..

echo ✓ Docker image pushed successfully

echo ☸️ Deploying to Kubernetes...

REM Apply Kubernetes manifests
kubectl apply -f deployment\kubernetes\secrets-configmap.yaml
kubectl apply -f deployment\kubernetes\backend-deployment.yaml

REM Wait for deployment
kubectl wait --for=condition=available --timeout=300s deployment/car-gallery-backend -n car-gallery

echo ✓ Kubernetes deployment completed

echo 📤 Uploading frontend to S3...

REM Upload frontend to S3
aws s3 sync Frontend\ s3://%S3_BUCKET_NAME% --delete

echo ✓ Frontend uploaded to S3

echo 🎉 Deployment completed successfully!
echo 📊 Deployment Information:
echo ECR Repository: %ECR_REPOSITORY_URL%
echo S3 Bucket: %S3_BUCKET_NAME%

pause