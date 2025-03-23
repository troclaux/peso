variable "aws_region" {
  default = "sa-east-1"
}

provider "aws" {
  region = var.aws_region
}

variable "aws_account_id" {
  default = "072216710152"
}

variable "ecr_repository" {
  default = "peso-repo"
}

variable "domain_name" {
  default = "pesodevops.com"
}

resource "aws_route53_zone" "pesodevops" {
  name = var.domain_name
}

resource "aws_route53_record" "peso_root" {
  zone_id = aws_route53_zone.pesodevops.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.peso_eip.public_ip]
}

resource "aws_route53_record" "peso_www" {
  zone_id = aws_route53_zone.pesodevops.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_name]
}

output "peso_url" {
  value = "https://${aws_route53_record.peso_root.name}"
}

output "peso_www_url" {
  value = "https://${aws_route53_record.peso_www.name}"
}

data "aws_caller_identity" "current" {}

variable "DATABASE_HOST" {}
variable "DATABASE_NAME" {}
variable "DATABASE_USER" {}
variable "DATABASE_PASSWORD" {}
variable "PUBLIC_IP" {}
variable "AUTH_GOOGLE_ID" {}
variable "AUTH_GOOGLE_SECRET" {}
variable "AUTH_SECRET" {}
variable "AUTH_TRUST_HOST" {}
variable "NEXTAUTH_URL" {}

resource "aws_secretsmanager_secret" "env_secret" {
  name = "peso-env-secret"
}

resource "aws_secretsmanager_secret_version" "env_secret_version" {
  secret_id = aws_secretsmanager_secret.env_secret.id
  secret_string = jsonencode({
    DATABASE_HOST      = var.DATABASE_HOST
    DATABASE_NAME      = var.DATABASE_NAME
    DATABASE_USER      = var.DATABASE_USER
    DATABASE_PASSWORD  = var.DATABASE_PASSWORD
    PUBLIC_IP          = var.PUBLIC_IP
    AUTH_GOOGLE_ID     = var.AUTH_GOOGLE_ID
    AUTH_GOOGLE_SECRET = var.AUTH_GOOGLE_SECRET
    AUTH_SECRET        = var.AUTH_SECRET
    AUTH_TRUST_HOST    = var.AUTH_TRUST_HOST
    NEXTAUTH_URL       = var.NEXTAUTH_URL
  })
}

resource "aws_iam_role" "ec2_role" {
  name = "ec2_secrets_manager_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "secrets_policy" {
  name        = "PesoEC2SecretsAccess"
  description = "Policy for EC2 to access Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.env_secret.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_secrets_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.secrets_policy.arn
}

resource "aws_iam_policy" "rds_access_policy" {
  name        = "PesoRDSAccess"
  description = "Policy for EC2 to access RDS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds-db:connect"
        ]
        Resource = "arn:aws:rds-db:${var.aws_region}:${data.aws_caller_identity.current.account_id}:dbuser:${aws_db_instance.postgres_db.resource_id}/${var.DATABASE_USER}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_rds_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.rds_access_policy.arn
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2_profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "sa-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "subnet_az2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "sa-east-1b"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow inbound traffic for EC2 with Docker Compose"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "Next.js App (internal access only)"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "Allow inbound traffic for RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_security_group" "docker_sg" {
  name        = "docker-sg"
  description = "Allow Docker containers to communicate"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "rds_ingress_my_ip" {
  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_sg.id
  cidr_blocks       = ["${var.PUBLIC_IP}/32"]
}

resource "aws_security_group_rule" "rds_ingress_docker" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.docker_sg.id
}

resource "aws_security_group_rule" "rds_ingress_ec2" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.ec2_sg.id
}

resource "aws_db_subnet_group" "main" {
  name        = "main-db-subnet-group"
  subnet_ids  = [aws_subnet.main.id, aws_subnet.subnet_az2.id]
  description = "Subnet group for RDS"
}

resource "aws_ecr_repository" "peso_repo" {
  name = "peso-repo"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "peso_repo_policy" {
  repository = aws_ecr_repository.peso_repo.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep only last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

resource "aws_iam_policy" "ecr_pull_policy" {
  name        = "ECRPullPolicy"
  description = "Policy to allow EC2 instances to pull images from ECR"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability",
        "ecr:DescribeRepositories"
      ],
      "Resource": "*"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "ecr_pull_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ecr_pull_policy.arn
}

resource "aws_instance" "peso_instance" {
  ami                         = "ami-04d88e4b4e0a5db46"
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.main.id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id, aws_security_group.docker_sg.id]
  associate_public_ip_address = true
  key_name                    = "my-key-pair"
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    usermod -aG docker ec2-user
  EOF

  tags = {
    Name = "Peso-Docker-Compose-Instance"
  }
}

resource "aws_db_instance" "postgres_db" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "14.17"
  instance_class         = "db.t3.micro"
  db_name                = var.DATABASE_NAME
  username               = var.DATABASE_USER
  password               = var.DATABASE_PASSWORD
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id, aws_security_group.docker_sg.id]
  multi_az               = false
  publicly_accessible    = true
  skip_final_snapshot    = true
  depends_on             = [aws_db_subnet_group.main, aws_security_group.rds_sg]
  # apply_immediately         = true
  # final_snapshot_identifier = null

  tags = {
    Name = "PostgreSQL DB"
  }
}

resource "aws_eip" "peso_eip" {
  instance = aws_instance.peso_instance.id
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_association" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_association_az2" {
  subnet_id      = aws_subnet.subnet_az2.id
  route_table_id = aws_route_table.public_rt.id
}

output "ec2_public_ip" {
  value = aws_instance.peso_instance.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres_db.endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.peso_repo.repository_url
}

