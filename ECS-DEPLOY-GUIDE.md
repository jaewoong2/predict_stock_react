# ECS Docker Compose 배포 가이드

## 파일 구조
```
docker-compose.ecs.yaml    # ECS용 Docker Compose 설정
deploy-ecs-simple.sh       # 간단한 ECS 배포 스크립트
deploy-ecs.sh             # 고급 ECS 배포 스크립트 (현재 문제 있음)
```

## 사용법

### 1. 로컬 테스트
```bash
# Docker Compose로 로컬 테스트
docker-compose -f docker-compose.ecs.yaml up --build

# 헬스체크 확인
curl http://localhost:3000/api/health

# 정리
docker-compose -f docker-compose.ecs.yaml down
```

### 2. ECS 배포
```bash
# 기본 배포 (안정성 확인 대기)
./deploy-ecs-simple.sh

# 빠른 배포 (안정성 확인 생략)
./deploy-ecs-simple.sh --no-wait
```

### 3. 환경 변수 설정
```bash
# AWS 프로필 변경
export AWS_PROFILE=your-profile

# AWS 리전 변경
export AWS_REGION=us-west-2

# 실행
./deploy-ecs-simple.sh
```

## Docker Compose ECS 설정 특징

- **플랫폼**: linux/amd64 (AWS Fargate 호환)
- **헬스체크**: /api/health 엔드포인트 사용
- **환경변수**: ECS와 동일한 프로덕션 설정
- **네트워크**: 격리된 브리지 네트워크

## 배포 스크립트 기능

1. **이미지 빌드**: Docker Compose를 사용한 멀티 아키텍처 빌드
2. **ECR 업로드**: 타임스탬프와 latest 태그로 이중 업로드
3. **ECS 업데이트**: 강제 새 배포로 서비스 갱신
4. **안정성 확인**: 배포 완료까지 대기 (옵션)
5. **URL 출력**: Terraform outputs에서 애플리케이션 URL 표시

## 문제 해결

### 이미지 찾기 실패
```bash
# 수동으로 이미지 확인
docker images | grep stock-predict

# 이미지가 없으면 빌드 확인
docker-compose -f docker-compose.ecs.yaml build --no-cache
```

### ECR 로그인 실패
```bash
# AWS 프로필 확인
aws sts get-caller-identity --profile lime_admin

# ECR 리전 확인
aws ecr describe-repositories --region ap-northeast-2 --profile lime_admin
```

### ECS 서비스 업데이트 실패
```bash
# ECS 클러스터 상태 확인
aws ecs describe-clusters --clusters stock-predict-cluster --region ap-northeast-2 --profile lime_admin

# 서비스 상태 확인
aws ecs describe-services --cluster stock-predict-cluster --services stock-predict-service --region ap-northeast-2 --profile lime_admin
```
