#!/bin/sh

echo "Cleaning up Docker space"
docker system prune -af
docker volume prune -f

echo "Authenticating with AWS ECR"
aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin 072216710152.dkr.ecr.sa-east-1.amazonaws.com

echo "Starting services with docker-compose (local version)"
docker compose -f docker-compose.local.yml pull
docker compose -f docker-compose.local.yml up -d

echo "Local deployment completed! Access the application at http://localhost:3000"

