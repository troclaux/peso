provider "aws" {
  region = "sa-east-1"
}

variable "DATABASE_HOST" {}
variable "DATABASE_NAME" {}
variable "DATABASE_USER" {}
variable "DATABASE_PASSWORD" {}
variable "PUBLIC_IP" {}
variable "AUTH_GOOGLE_ID" {}
variable "AUTH_GOOGLE_SECRET" {}
variable "AUTH_SECRET" {}
variable "AUTH_TRUST_HOST" {}

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
  })
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "sa-east-1a"
}

resource "aws_subnet" "subnet_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "sa-east-1b"
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow inbound traffic for EC2 and RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
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

resource "aws_instance" "app_instance" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.main.id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true
  key_name                    = "my-key-pair"

  tags = {
    Name = "Peso"
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
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  multi_az               = false
  publicly_accessible    = true
  skip_final_snapshot    = true
  # apply_immediately         = true
  # final_snapshot_identifier = null

  tags = {
    Name = "PostgreSQL DB"
  }
}

resource "aws_eip" "app_eip" {
  instance = aws_instance.app_instance.id
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
  value = aws_instance.app_instance.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres_db.endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.peso_repo.repository_url
}
