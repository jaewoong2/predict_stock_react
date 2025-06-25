#!/bin/bash

AWS_REGION="ap-northeast-2" 
AWS_PROFILE="lime_admin"
BUCKET_NAME="lime-stock"
CLOUDFRONT_DISTRIBUTION_ID="E3P7S7SJJJ4J6A"  # Replace with your actual CloudFront distribution ID

# Check if the S3 bucket exists
# if ! aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null; then
#     echo "S3 bucket $BUCKET_NAME does not exist. Creating it now..."
#     aws s3 mb s3://$BUCKET_NAME --region "$AWS_REGION" --profile "$AWS_PROFILE"
# else
#     echo "S3 bucket $BUCKET_NAME already exists."
# fi

pnpm run build

# Delete existing files in the S3 bucket
aws s3 rm s3://$BUCKET_NAME/ --recursive --region "$AWS_REGION" --profile "$AWS_PROFILE"
if [ $? -ne 0 ]; then
    echo "Failed to delete existing files in S3 bucket $BUCKET_NAME."
    exit 1
fi
echo "Existing files in S3 bucket $BUCKET_NAME deleted successfully."

# Upload the build files (dist) to the S3 bucket
aws s3 sync dist/ s3://$BUCKET_NAME/ --region "$AWS_REGION" --profile "$AWS_PROFILE"
echo "Build files uploaded to S3 bucket $BUCKET_NAME."

aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --profile "$AWS_PROFILE"
echo "CloudFront cache invalidated for distribution $CLOUDFRONT_DISTRIBUTION_ID."

# Output the URL of the deployed site
echo "Deployment completed successfully."
