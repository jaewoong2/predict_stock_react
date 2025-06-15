#!/bin/bash

AWS_REGION="ap-northeast-2" 
AWS_PROFILE="lime_admin"

# Check if the S3 bucket exists
BUCKET_NAME="lime-stock"
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null; then
    echo "S3 bucket $BUCKET_NAME does not exist. Creating it now..."
    aws s3 mb s3://$BUCKET_NAME --region "$AWS_REGION" --profile "$AWS_PROFILE"
else
    echo "S3 bucket $BUCKET_NAME already exists."
fi

# Build the project using pnpm
nvm use v22
pnpm run build

# Upload the build files (dist) to the S3 bucket
aws s3 sync dist/ s3://$BUCKET_NAME/ --region "$AWS_REGION" --profile "$AWS_PROFILE"
echo "Build files uploaded to S3 bucket $BUCKET_NAME."


CLOUDFRONT_DISTRIBUTION_ID="E3P7S7SJJJ4J6A"  # Replace with your actual CloudFront distribution ID
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --profile "$AWS_PROFILE"
echo "CloudFront cache invalidated for distribution $CLOUDFRONT_DISTRIBUTION_ID."
# Output the URL of the deployed site
echo "Deployment completed successfully."
