# WORKSPACE

The workspace micro service for the SALK platform

## How to retrieve the accounts api admin password from the cluster

The account admin api password is stored in the accounts secret in the k8s cluster.
To retrieve the password execute the command below.

```
kubectl -n salk get secrets accounts -o yaml|grep api_user_password|cut -d " " -f 4|base64 -d
```

## Local backend development

```
# store the accounts api admin password on the local disk

mkdir -p /opt/cloudharness/resources/auth/
kubectl -n salk get secrets accounts -o yaml|grep api_user_password|cut -d " " -f 4|base64 -d > /opt/cloudharness/resources/auth/api_user_password
```

example Visual Studio Code launch entry:
```
{
    "console": "integratedTerminal",
    "cwd": "${workspaceFolder}/applications/workspaces/backend",
    "justMyCode": false,
    "name": "Python: __main__",
    "program": "workspaces/__main__.py",
    "request": "launch",
    "type": "python",
    "env": {
        "CH_CURRENT_USER_ID": "<PUT HERE YOUR KEYCLOAK USER ID>",
    }
}
```

example port forwards to the k8s services
```
killall -9 kubectl
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep accounts | \awk '{print $1;}') 8080:8080 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep kafka | \awk '{print $1;}') 9092:9092 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep argo-server | \awk '{print $1;}') 2746:2746 &
```
