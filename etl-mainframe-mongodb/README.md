# ETL from Oracle to MongoDB

## Overview
The data loader is implemented using MongoSyphon (https://github.com/johnlpage/MongoSyphon) for the sake of simplicity. CDC is implmented based on polling of last_changed_dates which is configured inside of the MongoSyphon configuration files.

Please note that the error handling is marginal, i.e. loads should not be stopped as they are only check once for a maximum last_changed date. If the inital load breaks, restarting will not work and data from MongoDB should be deleted.

## Build
In order to build the deployable container, execute:
```
docker build -t ckurze/etl-mainframe-mongodb .
```

Optionally, push into the docker repository:
```
docker login

docker push ckurze/etl-mainframe-mongodb
```

## Run the Service

In order to run the container locally, execute the following command. Make sure to escape potential characters that will have an impact on the replacements of the configuration files via `sed` (e.g. the ampersand sign "&" ). The used version of MongoSyphon works with the long syntax for connections strings (in case you connect against Atlas, the mongodb+srv syntax will not work):
```
docker run \
-e MONGO_URI='mongodb://<USER>:<PASSWORD>@CLUSTER-PROJECT.mongodb.net:27017,CLUSTER-PROJECT.mongodb.net:27017,CLUSTER-PROJECT.mongodb.net:27017/test?ssl=true\&replicaSet=DemoCluster-shard-0\&authSource=admin\&retryWrites=true\&w=majority' \
-e ORACLE_URI='jdbc:oracle:thin:@//35.242.155.18:1521/XE' \
-t ckurze/etl-mainframe-mongodb
```

## Deploy to Kubernetes Cluster

Please modify the environment variables MONGO_URI and ORACLE_URI (as outlined above in "Run the service") to the proper values in `deployment/deployment-etl.yaml` and execute the following commands to install the CDC mechanism into a Kubernetes cluster:

```
kubectl apply -f deployment/deployment-etl.yaml
```
