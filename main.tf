provider "aws" {
  region = "sa-east-1"
}

variable "DATABASE_NAME" {}
variable "DATABASE_USER" {}
variable "DATABASE_PASSWORD" {}

# Fetch Latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "sa-east-1a"
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow inbound traffic for EC2 and RDS"

  ingress {
    from_port   = 80
    to_port     = 80
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

resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "Allow inbound traffic for RDS"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.1.0/24"]
  }
}

# Allow EC2 instances to access RDS
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
  subnet_ids  = [aws_subnet.main.id]
  description = "Subnet group for RDS"
}

resource "aws_ecr_repository" "peso_repo" {
  name = "peso-repo"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_instance" "app_instance" {
  ami                    = data.aws_ami.amazon_linux.id # Use latest Amazon Linux 2 AMI
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "Peso"
  }
}

resource "aws_db_instance" "postgres_db" {
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "13.3"
  instance_class          = "db.t2.micro"
  name                    = var.DATABASE_NAME
  username                = var.DATABASE_USER
  password                = var.DATABASE_PASSWORD
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  multi_az                = false
  publicly_accessible     = false  # More secure

  tags = {
    Name = "PostgreSQL DB"
  }
}

resource "aws_eip" "app_eip" {
  instance = aws_instance.app_instance.id
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
