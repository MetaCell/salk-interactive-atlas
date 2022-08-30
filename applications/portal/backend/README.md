# WORKSPACE

The workspace micro service for the SALK platform

## URLS
```
    /admin/         : admin web site
    /api/ui         : swagger ui for testing the openapi interface
    /api/schema     : openapi schema

    /media/         : media files
    /static/        : static files
```

## Mandatory manual steps
- Clone [cordmap](https://github.com/afonsobspinto/cordmap/tree/salk_test) (salk_test branch) into the workspaces directory

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

# Make the cloudharness application configuration available on your local machine
cp deployment/helm/values.yaml /opt/cloudharness/resources/allvalues.yaml

# create (if not exists) you local persistent folder
mkdir applications/workspaces/backend/persistent
```

you can use the default python django debug configuration or a custom one.

example Visual Studio Code launch entry:
```
    {
      "args": [
        "runserver"
      ],
      "cwd": "${workspaceFolder}/applications/workspaces/backend",
      "django": true,
      "env": {
        "CH_CURRENT_APP_NAME": "workspaces"
      },
      "justMyCode": false,
      "name": "Python: Django",
      "program": "manage.py",
      "request": "launch",
      "type": "python"
    },
```

you will also need to add our custom salk cord atlas to your brainglobe atlas storage:

```
tar -xf local-atlas/salk_cord_10um_v1.0.tar.gz
mv salk_cord_10um_v1.0 ~/.brainglobe
```

### database migrations
for kubernetes deployments the database migration is handled by the kubernetes job `workspaces-migrate`
see the djangomigrate.yml file in the deployment/templates folders

for local development you need to do the migration via executing the django manage command `migrate`

```
cd applications/workspaces/backend
export CH_CURRENT_APP_NAME=workspaces # this sets the current app for the cloudharness common library

python3 manage.py migrate

# or
./manage.py migrate
```

to start with a clean database first remove the `persistent\workspaces.sqlite3` file and then run the migrate command

### Superuser
for local development it's handy to have an user that can log in into the admin website
the Django `manage.py` has an option to create a superuser. Make sure you have your 
conda/virtual env activated and installed the `requirements.txt` and the cloudharness
dependency `cloudharness-common` (`python3 -m pip install <ch libraries folder>/cloudharness-common`)

```
cd applications/workspaces/backend
export CH_CURRENT_APP_NAME=workspaces # this sets the current app for the cloudharness common library

python3 manage.py createsuperuser

# or
./manage.py createsuperuser
```

### create new database migrations for model changes
django supports also automatic generation of migration of existing and new database through the `makemigration`
command. This command will create a new file in the `api/migrations` folder

```
cd applications/workspaces/backend
export CH_CURRENT_APP_NAME=workspaces # this sets the current app for the cloudharness common library

python3 manage.py makemigrations api

# or
./manage.py makemigrations api
```

### example port forwards to the k8s services
```
killall -9 kubectl
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep accounts | \awk '{print $1;}') 8080:8080 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep kafka | \awk '{print $1;}') 9092:9092 &
kubectl port-forward --namespace salk $(kubectl get po -n salk | grep argo-server | \awk '{print $1;}') 2746:2746 &
```

### running the server
to start the django server you can either start the debugger command or run it from the linux prompt

```
cd applications/workspaces/backend
export CH_CURRENT_APP_NAME=workspaces # this sets the current app for the cloudharness common library

python3 manage.py runserver

# or
./manage.py runserver
```

### Installation errors

error:

`Error: INSTALLATION FAILED: failed post-install: warning: Hook post-install mnp/templates/workspaces/djangomigrate.yml failed: jobs.batch "workspaces-migrate" already exists`

solution:

```
kubectl -n mnp delete job workspaces-migrate
```
