# SALK

The SALK Mouse Cord Atlas

## Deploy

### Prerequisites

The SALK deployment is built on top of [CloudHarness](https://github.com/MetaCell/cloud-harness).
CloudHarness is a base infrastructure and common utilities for microservice applications deployed on Kubernetes.

CloudHarness and SALK use Python 3.9, it is recommended to setup a virtual environment first.

With conda: 
```bash
conda create --name salk python=3.9
conda activate salk
```

To install CloudHarness:

```
git clone --branch release/2.1.0 https://github.com/MetaCell/cloud-harness.git
cd cloud-harness
pip install -r requirements.txt
```



## Deploy to a K8s cluster

Make sure that you are using the correct K8s context (check `kubectl config get-contexts`)
Or set your context using `kubectl config set-context`

Requirements:
* helm installed (https://helm.sh/docs/intro/install/)
* kubectl installed (https://kubernetes.io/docs/tasks/tools/)
* skaffold installed (https://skaffold.dev/docs/install/)


```bash
conda activate salk

# prepare the Helm chart
harness-deployment cloud-harness . -t <docker tag> -d <the.domain.com> -r <docker registry> -rs <docker registry secret> -n <namespace> -e prod -i portal

# build the images
skaffold build

# install the application
helm upgrade salk ./deployment/helm --install --reset-values --version 0.0.1 --namespace <namespace> --values ./deployment/helm/values.yaml --timeout 600s
```


## Development setup

Minikube is recommended to setup locally. The procedure is different depending on where Minikube is installed.
The simplest procedure is with Minikube hosted in the same machine where running the commands.

Run the `setup.sh` script to setup your minikube cluster.
The script will also build all Docker images and installs the deployment using `skaffold`

Requirements:
* helm installed (https://helm.sh/docs/intro/install/)
* kubectl installed (https://kubernetes.io/docs/tasks/tools/)
* minikube installed (https://minikube.sigs.k8s.io/docs/start/)
* skaffold installed (https://skaffold.dev/docs/install/)
