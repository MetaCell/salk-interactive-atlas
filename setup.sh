#!/bin/bash

# Setup script for creating a minikube instance and build the needed applications

minikube start --profile salk --memory 12000 --cpus 4 --disk-size 60g --driver=docker

minikube --profile salk addons enable ingress
minikube --profile salk addons enable metrics-server


kubectl config use-context salk
kubectl create ns salk
kubectl create rolebinding salk-admin-default --clusterrole=admin --serviceaccount=salk:default -n salk

eval $(minikube --profile salk docker-env)
kubectl config use-context salk

harness-deployment cloud-harness . -l -d salk.local -dtls -n salk -e dev -i portal
#cp deployment/helm/values.yaml /opt/cloudharness/resources/allvalues.yaml

kubectl config use-context salk

# skaffold dev --cleanup=false
skaffold run
#helm upgrade salk ./deployment/helm --install --reset-values --version 0.0.1 --namespace salk --values ./deployment/helm/values.yaml --timeout 600s 

echo To activate the minikube cluster please execute: eval \$\(minikube docker-env\)
