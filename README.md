# MongoDB Demo: How to create a Single View of Customer in order Modernize Legacy Sytems, Mainframe Offloading and creating a Microservices Architecture

MongoDB is used by many large organizations to build mission-critical applications - lowering TCO, increasing developer productivity, de-risking development phases and therefore enabling companies to leverage data and technology for competitive advantage.

This project demonstrates how to create a Single of Customer based on an example in the insurance sector. A large-scale example of unifying more than 100 million individual customers is [MetLife](https://www.mongodb.com/customers/metlife): a working prototype has been built in just two weeks, three months later the project has been in production. This demonstration explains three major use cases:

* **Mainframe Offloading:** Release legacy mainframes from MIPS intensive workloads by offloading data and processes to a modern scalable data layer allowing you to reduce cost and enable new use cases demanded by business.
* **Single View of your business:** Centralize, organize and present your business relevant information from various sources and channels to serve the business demands like 360 customer view, Single source of Risk or centralized governance.
* **Legacy Modernization:** Address the range of new business requirements and modernize in an agile, highly efficient, scalable & timely manner.

The following core capabilites of MongoDB are demonstrated:

* Flexible Data Model
* Data Ingestion from relational sources
* ...

## Demo Overview

TBD

## Getting Started

TBD

### Prerequisites

TBD

# Deployment

## Containerized Environment, e.g. Google Kubernetes Engine or OpenShift

__0. Preconditions__
A working Kubernetes cluster exists. All operations assume that we use Google Kubernets Engine. All commands assume that you are in the root directory of this repository and a cluster ```mdb-insurance-demo``` has been spun up in zone ```europe-west3-a``` it belongs to the project ```ckurze-k8s-operator-234311```. 

Login to Google Cloud (this will open a browser window to authenticate yourself against GCP):
```
gcloud auth login
```

Set the proper Kubernetes Context:
```
gcloud config set project ckurze-k8s-operator-234311
gcloud config set compute/zone europe-west3-a
```

Get the creentials and work with the new cluster:
```
gcloud container clusters get-credentials mdb-insurance-demo
```

Some operations require admin privileges, so create a cluster-admin role binding:
```
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user <YOUR.GCP.ACCOUNT@gmail.com>
```

#######kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user ck.mongo@gmail.com

__1. Install Mainframe / Oracle__
__1.1 Create Oracle Instance in Kubernetes__
The insurance core system runs on Oracle today. The demo will use a containerized version. It can be installed as following:
```
kubectl apply -f oracle/deployment/oracle-deployment.yaml 
kubectl apply -f oracle/deployment/oracle-service.yaml
```

Double-check that the pods and service have been created:
```
kubectl get pods

NAME       READY     STATUS    RESTARTS   AGE
oracledb   1/1       Running   0          4m

kubectl get services

NAME               TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)          AGE
kubernetes         ClusterIP      10.23.240.1    <none>           443/TCP          54m
oracledb-service   LoadBalancer   10.23.251.48   35.242.219.126   1521:31039/TCP   23m
```

__1.2 Create the Schemata in Oracle for Car and Home Insurance__
Connect to Oracle, e.g. via SQLDeveloper, using the EXTERNAL-IP outlined above on PORT 1521. Username is ```system```, the password is ```qwer1234``` (as defined in ```oracle-deployment.yaml```). Execute the following commands that will create two users/schemas in Oracle for car and home insurance, respectively:

```
CREATE USER carinsurance IDENTIFIED BY carinsurance;
CREATE USER homeinsurance IDENTIFIED BY homeinsurance;

GRANT ALL PRIVILEGES TO carinsurance;
GRANT ALL PRIVILEGES TO homeinsurance;
```

__1.3 Generate the Sample Data__
The generation of sample data is performed in three steps:
* Generate the Customers to a CSV file in the output directory
* Generate Car Insurance Data and upload into Oracle as well as CSV files in the output directory
* Generate Home Insurance Data and upload into Oracle as well as CSV files in the output directory

__Important:__ Ensure that the target tables in Oracle do not exist, otherwise the generators throw an error. In case you need to drop them, execute the following statements as system user:
```
DROP TABLE HOMEINSURANCE.CLAIM;
DROP TABLE HOMEINSURANCE.CUSTOMER;
DROP TABLE HOMEINSURANCE.POLICY;
DROP TABLE HOMEINSURANCE.POLICY_COVERAGE;
DROP TABLE HOMEINSURANCE.POLICY_OPTION;
DROP TABLE HOMEINSURANCE.POLICY_RISK;

DROP TABLE CARINSURANCE.CAR_CLAIM;
DROP TABLE CARINSURANCE.CAR_CUSTOMER;
DROP TABLE CARINSURANCE.CAR_POLICY;
```

The following commands need to be executed to generate the data and load it into Oracle (there will also be a CSV version of the data in the ```output``` directory):
```
cd data-generate-oracle/

# We recommend to generate 80k customers to have a meaningful example. For smaller demonstration purposes, it can be less.
python faker_customers_to_csv.py 80000

# Generate Car Insurance (Schema: CARINSURANCE, Password: carinsurance)
# Usage: python faker_car_insurance.py <ORACLE_HOST> <ORACLE_PORT> <ORACLE_SYSTEM_PASSWORD> <NUMBER_OF_CUSTOMERS>
# Note: Due to the internal selection of customers (birth dates should match the insurance start date, etc.) the actual number
#       of generated customers can be lower than the number provided here, so please add a buffer of 25%.
python faker_car_insurance.py 35.242.219.126 1521 qwer1234 50000

# Generate Home Insurance (Schema: HOMEINSURANCE, Password: homeinsurance)
# Usage: python faker_home_insurance.py <ORACLE_HOST> <ORACLE_PORT> <ORACLE_SYSTEM_PASSWORD> <NUMBER_OF_CUSTOMERS_MAX_256136>
# Note: Due to the internal selection of customers (birth dates should match the insurance start date, etc.) the actual number
#       of generated customers can be lower than the number provided here, so please add a buffer of 25%.
#       The maximum number is 256136, as the file home_insurance.csv is taken as a basis and it contains 256136 rows.
python faker_home_insurance.py 35.242.219.126 1521 qwer1234 50000
```

__2. Install MongoDB OpsManager & MongoDB ReplicaSet__
Install a MongoDB OpsManager following the instructions of [Install a Simple Test Ops Manager Installation](https://docs.opsmanager.mongodb.com/current/tutorial/install-simple-test-deployment/)

__2.1 Generate API Key and Configure IP Whitelist for External Access to OpsManager API__
* Log in to OpsManager
* Click your username in the top right of the screen and choose Account
* Click the tab Public API Access
* Generate a new API Key and store it somewhere save (remeber, it is like a password)
* Add a whitelist entry for your Kubernetes Cluster (for GCP you find it when you click on your Kuberentes Cluster in Google Console -> Endpoint (e.g. 35.198.84.76 - the Whitelist entry should be 35.0.0.0/8).

__2.2 Install MongoDB Enterprise Kubernetes Operator into Your Cluster__
* Create the namespace ```mongodb``` via ```kubectl create namespace mongodb```
* Follow the instructions outlined in [Install the MongoDB Enterprise Kubernetes Operator](https://docs.mongodb.com/kubernetes-operator/stable/tutorial/install-k8s-operator/)
  __Note:__ If you deploy into an OpenShift environment, remember to set the parameter ```MANAGED_SECURITY_CONTEXT``` to ```'true' ``` (note the quotes).

Example ```samples/project.yaml``` file: 
```
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-project
  namespace: mongodb
data:
  projectName: InsuranceDemo
  baseUrl: http://ec2-XXX-XXX-XXX-XXX.eu-central-1.compute.amazonaws.com:8080
```

Example call to create credentials:
```
kubectl -n mongodb \
  create secret generic my-credentials \
  --from-literal="user=christian.kurze@mongodb.com" \
  --from-literal="publicApiKey=XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX"
```

__2.3 Install a MongoDB ReplicaSet__
Modify the file ```samples/minimal/replica-set.yaml```:
```
---
apiVersion: mongodb.com/v1
kind: MongoDB
metadata:
  name: my-replica-set
  namespace: mongodb
spec:
  members: 3
  version: 4.0.9
  type: ReplicaSet

  project: my-project
  credentials: my-credentials

  persistent: true
  
  # log level affects the level of logging for the agent. Use DEBUG cautiously as log file size may grow very quickly
  logLevel: ERROR

  persistent: true
  podSpec:
    cpu: '0.5'
    memory: 512M
    # "multiple" persistence allows to mount different directories to different Persistent Volumes
    persistence:
      single:
        storage: 1Gi
```

Execute the command:
```
kubectl apply -f samples/minimal/replica-set.yaml 
```

If any errors occur, check the logs of the pods forming the workload ```mongodb-enterprise-operator``` or, if the database starts to get created, of ```my-replica-set```.

__3. Configure Data Load from Oracle to MongoDB__
__3.1 Execute Initial Data Load from Oracle to MongoDB__

__3.2 Start Change Data Capture from Oraclt to MongoDB__

__4. Install Mainframe Simulation__
The following steps will install a service to encapsulate the mainframe. It is a Spring Boot application in combination with a web application designed to look like a mainframe.

__4.1 Install Mainframe Service__
Adopt the configuration of ```mainframe-service/deployment/mainframe-service-deployment.yaml``` to match the IP address of your Oracle database in the Kubernetes Cluster:
```
apiVersion: v1
kind: Pod
metadata:
    name: mainframe-service
    labels:
      env: mainframe-service
spec:
  containers:
  - image: ckurze/mainframe-service
    name: mainframe-service
    env:
      - name: TZ
        value: CET
      - name: spring.datasource.url
        value: jdbc:oracle:thin:@YOUR_ORACLE_IP_HERE:1521:XE
      - name: spring.datasource.username
        value: CARINSURANCE
      - name: spring.datasource.password
        value: carinsurance
```
Install the deployment as well as the service into the Kubernetes cluster. It will map the service to port 8080:
```
kubectl apply -f mainframe-service/deployment/mainframe-service-deployment.yaml
kubectl apply -f mainframe-service/deployment/mainframe-service-service.yaml
```

The public IP address will depend on the service creation. The following endpoints should work now:
```
# List of all customers:
http://35.234.79.85:8080/car/customer/all

# Individual customer:
http://35.234.79.85:8080/car/customer/C000014831

# Individual policy:
http://35.234.79.85:8080/car/policy/PC_000000002
```

__4.2 Install Mainframe Web Application__

__5. Install Modern Insurance Portal__

__5.1 Install Insurance Service__
Adopt the configuration of ```insurance-service/deployment/insurance-service-deployment.yaml``` to match the MongoDB ReplicaSet in your Kubernetes Cluster:
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: insurance-service-deployment
  labels:
    app: insurance-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: insurance-service
  template:
    metadata:
      labels:
        app: insurance-service
    spec:
      containers:
      - name: insurance-service
        image: ckurze/insurance-service
        ports:
        - containerPort: 4000
          protocol: TCP
        env:
        - name: ENV
          value: "development"
        - name: PORT
          value: "4000"
        - name: DB
          value: "mongodb://my-replica-set-0.my-replica-set-svc.mongodb.svc.cluster.local:27017,my-replica-set-1.my-replica-set-svc.mongodb.svc.cluster.local:27017,my-replica-set-2.my-replica-set-svc.mongodb.svc.cluster.local:27017/insurance?replicaSet=my-replica-set"
```
Install the deployment as well as the service into the Kubernetes cluster. It will map the service to port 8080:
```
kubectl apply -f insurance-service/deployment/insurance-service-deployment.yaml 
kubectl apply -f insurance-service/deployment/insurance-service-service.yaml
```

The public IP address will depend on the service creation. The following endpoints should work now:
```
# List of all customers (paginated with 100 customers):
http://35.246.137.155:4000/customer
http://35.246.137.155:4000/customer?page=2
http://35.246.137.155:4000/customer?page=3

# All parameters, except 'page' are transformed into a query.
# Get customer with particular ID:
http://35.246.137.155:4000/customer?customer_id=C000038970
# Get customer with a particular home insurance policy:
http://35.246.137.155:4000/customer?home_insurance.policy_id=P000003753
```

__5.2 Install Insurance Web Application__


# Authors

This demo is a joint effort of Felix Reichenbach, Sven Mentl, Sani Chabi-Yo, and Christian Kurze.

# License

