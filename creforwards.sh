killall -9 kubectl
# kubectl port-forward --namespace salk $(kubectl get po -n salk | grep workspaces-postgres | \awk '{print $1;}') 5432:5432 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep accounts | \awk '{print $1;}') 8080:8080 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep kafka | \awk '{print $1;}') 9092:9092 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep argo-server | \awk '{print $1;}') 2746:2746 &
