#!/bin/sh
# .env 파일에서 환경 변수 로드
export $(grep -v '^#' .env | xargs)
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_REGION

aws s3 sync .next/static s3://$AWS_BUCKET_NAME/_next/static