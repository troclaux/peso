#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y

sudo snap install aws-cli --classic

curl -sfL https://get.k3s.io | sh -
