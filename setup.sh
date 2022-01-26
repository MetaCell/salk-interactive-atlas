#!/bin/bash

# Setup script for creating a minikube instance and build the needed applications

minikube start --memory 6000 --cpus 4 --disk-size 60g --driver=docker

minikube addons enable ingress
minikube addons enable metrics-server


kubectl config use-context minikube
kubectl create ns salk
kubectl create rolebinding salk-admin-default --clusterrole=admin --serviceaccount=salk:default -n salk

eval $(minikube docker-env)

kubectl config use-context minikube
harness-deployment cloud-harness . -m build -u -l -d salk.local -dtls -n salk -e dev -i salk-portal

kubectl config use-context minikube
skaffold debug --cleanup=false

echo To activate the minikube cluster please execute: eval \$\(minikube docker-env\)
