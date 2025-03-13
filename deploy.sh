#!/bin/bash

sudo kubectl delete secret peso-secrets && sudo kubectl create secret generic peso-secrets --from-env-file=.env.local
sudo kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.0/cert-manager.yaml
sudo kubectl apply -f ./k8s/ec2-deployment.yaml
sudo kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
