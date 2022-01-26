# SALK

An updated version of the Open Source Brain platform

## Deploy

### Prerequisites

The SALK deployment is built on top of [CloudHarness](https://github.com/MetaCell/cloud-harness).
The deployment process is based on Python 3.7+ scripts. It is recommended to setup a virtual 
environment first.

With conda: 
```bash
conda create --name salk python=3.7
conda activate salk
```

To install CloudHarness:

```
git clone https://github.com/MetaCell/cloud-harness.git
cd cloud-harness
pip install -r requirements.txt
```

## Development setup

Minikube is recommended to setup locally. The procedure is different depending on where Minikube is installed.
The simplest procedure is with Minikube hosted in the same machine where running the commands.

Run the `setup.sh` script to setup your minikube cluster.
The script will also build all Docker images and installs the deployment using `skaffold`

Requirements:
* minikube installed
* kubectl installed
* skaffold installed
* helm installed
