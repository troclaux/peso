#!/bin/bash

AWS_PASSWORD=$(sudo aws ecr get-login-password --region sa-east-1)
sudo kubectl delete secret regcred --ignore-not-found
sudo kubectl create secret docker-registry regcred \
  --docker-server=072216710152.dkr.ecr.sa-east-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password="$AWS_PASSWORD"
sudo kubectl delete secret peso-secrets --ignore-not-found
sudo kubectl create secret generic peso-secrets --from-env-file=.env.local

sudo kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.0/cert-manager.yaml
sudo kubectl apply -f ~/k8s/ec2-deployment.yaml
sudo kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
