#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y

sudo snap install aws-cli --classic

curl -sfL https://get.k3s.io | sh -

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.0/cert-manager.yaml
