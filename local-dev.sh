rm /opt/cloudharness/resources/auth/api_user_password
kubectl -n salk get secrets accounts -o yaml|grep api_user_password|cut -d " " -f 4|base64 -d > /opt/cloudharness/resources/auth/api_user_password
cp deployment/helm/values.yaml /opt/cloudharness/resources/allvalues.yaml