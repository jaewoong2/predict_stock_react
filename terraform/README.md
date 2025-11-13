# Stock Predict React - Terraform 인프라 배포 가이드

이 프로젝트는 AWS ECS Fargate Spot Instance를 사용하여 Next.js 애플리케이션을 최소 비용으로 배포하는 Terraform 구성입니다.

## 📋 사전 요구사항

1. **AWS CLI 설치 및 구성**
   ```bash
   aws configure
   ```

2. **Terraform 설치** (>= 1.0)

3. **Docker 설치**

4. **기존 AWS 리소스 정보 수집**
   - VPC ID
   - Public Subnet ID들 (최소 2개, 다른 AZ에 위치)
   - Security Group ID (HTTP/HTTPS 트래픽 허용)

## 🚀 배포 단계

### 1. Terraform 변수 설정

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` 파일을 편집하여 실제 값으로 변경:

```hcl
aws_region = "ap-northeast-2"
project_name = "stock-predict"
environment = "prod"

# 기존 인프라 정보 (실제 값으로 변경 필요)
vpc_id = "vpc-실제VPC_ID"
public_subnet_ids = [
  "subnet-실제서브넷1_ID",
  "subnet-실제서브넷2_ID"
]
security_group_id = "sg-실제보안그룹_ID"

domain_name = "stock.biizbiiz.com"
```

### 2. Terraform 초기화 및 계획

```bash
terraform init
terraform plan
```

### 3. 인프라 배포

```bash
terraform apply
```

### 4. Docker 이미지 빌드 및 배포

```bash
cd ..
./deploy-ecs.sh
```

## 📊 배포된 리소스

### ECS 구성
- **ECS 클러스터**: Fargate Spot Instance 사용
- **ECS 서비스**: 1개 태스크 실행 (최소 비용)
- **태스크 스펙**: 256 CPU, 512MB 메모리

### 네트워킹
- **Application Load Balancer**: HTTP 트래픽 라우팅
- **Target Group**: ECS 태스크 대상
- **기존 VPC/Subnet 활용**: 추가 네트워킹 비용 없음

### 모니터링
- **CloudWatch Logs**: 7일 보관 (비용 절약)
- **Container Insights**: 비활성화 (비용 절약)

### 저장소
- **ECR Repository**: Docker 이미지 저장
- **Lifecycle Policy**: 최신 5개 이미지만 보관

## 💰 비용 최적화 특징

1. **Spot Instance 사용**: 일반 Fargate 대비 최대 70% 비용 절감
2. **최소 리소스**: 256 CPU, 512MB 메모리로 시작
3. **단일 인스턴스**: 개발/테스트 환경에 적합
4. **로그 보관 기간**: 7일로 제한
5. **기존 네트워크 활용**: VPC, Subnet, SG 재사용

## 🔧 사용법

### 애플리케이션 업데이트
```bash
./deploy-ecs.sh
```

### 서비스 스케일링
```bash
aws ecs update-service \
  --cluster stock-predict-cluster \
  --service stock-predict-service \
  --desired-count 2
```

### 로그 확인
```bash
aws logs tail /ecs/stock-predict --follow
```

### 인프라 삭제
```bash
terraform destroy
```

## 🌐 도메인 연결

ALB DNS를 도메인에 연결하려면:

1. Route 53에서 A 레코드 생성:
   ```
   stock.biizbiiz.com -> ALB DNS (Alias)
   ```

2. 또는 CNAME 레코드:
   ```
   stock.biizbiiz.com -> [ALB DNS 이름]
   ```

## 📝 주의사항

1. **Spot Instance**: 가격 변동이나 용량 부족시 중단될 수 있음
2. **단일 AZ**: 고가용성이 필요한 경우 multi-AZ 구성 고려
3. **HTTPS**: 프로덕션에서는 SSL/TLS 인증서 설정 권장
4. **모니터링**: 중요한 애플리케이션의 경우 CloudWatch 알람 설정

## 🔍 문제 해결

### ECS 태스크가 시작되지 않는 경우
```bash
aws ecs describe-services --cluster stock-predict-cluster --services stock-predict-service
aws ecs describe-tasks --cluster stock-predict-cluster --tasks [TASK-ARN]
```

### ECR 로그인 실패
```bash
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [ACCOUNT-ID].dkr.ecr.ap-northeast-2.amazonaws.com
```

### 로드밸런서 헬스체크 실패
- Next.js 애플리케이션의 `/api/health` 엔드포인트 확인
- 보안 그룹에서 포트 3000 허용 확인

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. AWS 리소스 제한 및 권한
2. Terraform 상태 파일 무결성
3. Docker 이미지 빌드 로그
4. ECS 서비스 이벤트 로그
