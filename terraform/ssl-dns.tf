# 기존 ACM 인증서 참조 (domain으로 조회)
data "aws_acm_certificate" "app" {
  domain = var.domain_name
}

# Route 53 Hosted Zone (기존 호스트 존 사용)
data "aws_route53_zone" "main" {
  name         = "bamtoly.com"
  private_zone = false
}

# Route 53 Record for ALB
resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.app.dns_name
    zone_id                = aws_lb.app.zone_id
    evaluate_target_health = true
  }
}
