#!/bin/bash

# ECS 배포 스크립트 (Docker Compose 지원)
set -e

# 변수 설정
AWS_REGION=${AWS_REGION:-"ap-northeast-2"}
AWS_PROFILE=${AWS_PROFILE:-"lime_admin"}
PROJECT_NAME="stock-predict"
ECR_REPO_NAME="${PROJECT_NAME}-app"
DOCKER_COMPOSE_FILE="docker-compose.ecs.yaml"

echo "🚀 Starting ECS deployment process..."
echo "📍 Region: ${AWS_REGION}"
echo "👤 Profile: ${AWS_PROFILE}"
echo "🏷️  ECR Repository: ${ECR_REPO_NAME}"

# AWS 계정 ID 가져오기
echo "Getting AWS account information..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile ${AWS_PROFILE} --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
echo "✅ AWS Account ID: ${AWS_ACCOUNT_ID}"

# ECR 로그인
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} --profile ${AWS_PROFILE} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Docker 이미지 빌드 (Docker Compose 사용)
echo "🔨 Building Docker image with Docker Compose..."
docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache stock-predict-ecs

# 빌드된 이미지 태그
echo "🏷️  Tagging Docker image..."
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# 빌드된 이미지 찾기
IMAGE_NAME=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep stock-predict-ecs | head -1)
echo "Found image: ${IMAGE_NAME}"

docker tag ${IMAGE_NAME} ${ECR_URI}:latest
docker tag ${IMAGE_NAME} ${ECR_URI}:${TIMESTAMP}

# ECR에 이미지 푸시
echo "📤 Pushing Docker image to ECR..."
docker push ${ECR_URI}:latest
docker push ${ECR_URI}:${TIMESTAMP}

# ECS 서비스 업데이트
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster ${PROJECT_NAME}-cluster \
    --service ${PROJECT_NAME}-service \
    --force-new-deployment \
    --region ${AWS_REGION} \
    --profile ${AWS_PROFILE}

echo "✅ Deployment initiated successfully!"

# 배포 상태 확인 (옵션)
if [[ "$1" != "--no-wait" ]]; then
    echo "📊 Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --cluster ${PROJECT_NAME}-cluster \
        --services ${PROJECT_NAME}-service \
        --region ${AWS_REGION} \
        --profile ${AWS_PROFILE}
    echo "🎉 Deployment completed successfully!"
fi

# 애플리케이션 URL 출력
if [[ -d "terraform" ]]; then
    DOMAIN_URL=$(cd terraform && terraform output -raw application_url 2>/dev/null || echo "")
    if [[ -n "$DOMAIN_URL" ]]; then
        echo "🌐 Application URL: ${DOMAIN_URL}"
    fi
fi

echo "🚀 Deployment process completed!"
