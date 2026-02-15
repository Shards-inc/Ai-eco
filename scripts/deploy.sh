#!/bin/bash
ENV=$1
echo "Deploying to $ENV..."
kubectl apply -f infrastructure/kubernetes/