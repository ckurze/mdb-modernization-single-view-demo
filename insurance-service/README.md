# Insurance Single View Service on MongoDB

## Overview
This Python Flask application provides a RESTful service interface to access the insurance single view based on MongoDB.

## Test
In order to test locally, ```docker-compose.yml``` provides the parameter for accessing MongoDB as well as the ports on which the application should be accessible. If you perform changes in the source code, it will be automatically reloaded.

Start the local application with:
```
docker-compose up --build
```

After the successfull startup, the application can be accessed via your web browser on port 4000:
```
# List of all customers (paginated with 100 customersby defaul):
http://localhost:4000/customer
http://localhost:4000/customer?page=2
http://localhost:4000/customer?page=3

# All parameters, except 'page' and 'customers_paer_page' are transformed into a query.
# Get customer with particular ID:
http://localhost:4000/customer?customer_id=C000038970
# Get customer with a particular home insurance policy:
http://localhost:4000/customer?home_insurance.policy_id=P000003753
```

## Build
Create a docker image from the sources:
```
docker build -t ckurze/insurance-service .
```

Optionally, push into the docker repository:
```
docker login

docker push ckurze/insurance-service
```

## Run the Service

After building the docker image, it can be run with:
```
docker run \
-p 4000:4000 \
-e ENV=development \
-e PORT=4000 \
-e DB=mongodb://host.docker.internal:27017/insurance \
--name insurance-serivce \
-t ckurze/insurance-service
```


## Deploy to Kubernetes Cluster

This example uses a minishift installation, should also work on minikube and other Kubernetes implementations.

```
# Login to minishift
oc login -u system

# Create a new namespace 'insurance':
# (Alternative kubectl create namespace insurance)
oc new-project insurance

# Apply the deployment and service.
# The service will be available at http://192.168.99.100:30001/ (depending on your Kubernetes cluster IP).
kubectl apply -f packaging/deployment.yaml
kubectl apply -f packaging/service.yaml
```
