#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y

sudo apt install -y docker.io
sudo apt install -y docker-compose

sudo systemctl enable docker
sudo systemctl start docker

sudo snap install aws-cli --classic
