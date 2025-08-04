output "application_url" {
  description = "URL of the application"
  value       = "https://${var.domain_name}"
}

output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.app.dns_name
}

output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  description = "ECS Cluster Name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS Service Name"
  value       = aws_ecs_service.app.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.app.name
}

output "domain_name" {
  description = "Application domain name"
  value       = var.domain_name
}

output "ssl_certificate_arn" {
  description = "SSL certificate ARN"
  value       = "arn:aws:acm:ap-northeast-2:849441246713:certificate/e80e01ba-12e8-4420-8aeb-6e36fc578fc0"
}
