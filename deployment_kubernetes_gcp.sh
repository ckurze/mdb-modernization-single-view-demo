#!/bin/sh

# Prerequisites:
# OpsManager with API Key and IP Whitelist entries for Kubernetes Cluster

# Helper for parameter checks
helpFunction()
{
   echo ""
   echo "Usage: $0 -p project-name -z compute-zone"
   echo "\t-a Account, e.g. gcpuser@gmail.com"
   echo "\t-p Project name in GCP, e.g. ckurze-k8s-operator-234311"
   echo "\t-z Compute zone where the k8s cluster is deployed, e.g. europe-west3-a"
   echo "\t-n Name of the k8s cluster, e.g. mdb-demo-cluster"
   echo "\t-b Base URL of OpsManager, e.g. http://ec2-18-184-219-176.eu-central-1.compute.amazonaws.com:8080"
   echo "\t-u User in OpsManager, e.g. username@mongodb.com"
   echo "\t-k API Key for RESTful access to OpsManager API, e.g. 6cdeeb2c-8815-4695-a071-c19921e2afce"
   echo "\t-o Organisation ID in OpsManager, e.g. 5c5abd39cc6d0c62773330ed"
   echo "\t-j Project name to be created in OpsManager, e.g. SingleViewDemo"
   exit 1 # Exit script after printing help
}

# Read and parse the command-line options
while getopts "a:p:z:n:b:u:k:o:j:" opt
do
   case "$opt" in
      a ) ACCOUNT="$OPTARG" ;;
      p ) PROJECT="$OPTARG" ;;
      z ) COMPUTEZONE="$OPTARG" ;;
      n ) CLUSTERNAME="$OPTARG" ;;
      b ) BASEURL="$OPTARG" ;;
      u ) USERNAME="$OPTARG" ;;
      k ) KEY="$OPTARG" ;;
      o ) ORGID="$OPTARG" ;;
      j ) PROJECTNAME="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$ACCOUNT" ] || [ -z "$PROJECT" ] || [ -z "$COMPUTEZONE" ] || [ -z "$CLUSTERNAME" ] || [ -z "$BASEURL" ] || [ -z "$USERNAME" ] || [ -z "$KEY" ] || [ -z "$ORGID" ] || [ -z "$PROJECTNAME" ]
then
   echo "Please provide all mandatory parameters";
   helpFunction
fi

echo ""
echo "Logging in and set some parameters..."
#gcloud auth login
gcloud config set project $PROJECT
gcloud config set compute/zone $COMPUTEZONE

# Automatically generate cluster
# gcloud beta container --project "ckurze-k8s-operator-234311" clusters create "mdb-demo-cluster" --zone "europe-west3-a" --no-enable-basic-auth --cluster-version "1.12.8-gke.10" --machine-type "n1-standard-2" --image-type "COS" --disk-type "pd-standard" --disk-size "100" --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --num-nodes "3" --enable-cloud-logging --enable-cloud-monitoring --enable-ip-alias --network "projects/ckurze-k8s-operator-234311/global/networks/default" --subnetwork "projects/ckurze-k8s-operator-234311/regions/europe-west3/subnetworks/default" --default-max-pods-per-node "110" --addons HorizontalPodAutoscaling,HttpLoadBalancing --enable-autoupgrade --enable-autorepair
gcloud container clusters get-credentials $CLUSTERNAME

# Some actions require admin privileges so bind the user to to the role cluster-admin
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $ACCOUNT

echo ""
echo "Deploying Oracle..."
kubectl apply -f mainframe-oracle/deployment/oracle-pass-secret.yaml
kubectl apply -f mainframe-oracle/deployment/persistent/oracle-deployment.yaml 
sleep 10

echo ""
echo "Get the pod name of Oracle..."
ORACLE_POD=$(kubectl get pods | grep oracledb | awk '{print $1}')
echo "Found: $ORACLE_POD"
echo "Waiting for Oracle pod to be deployed..."
while [[ $(kubectl get pods $ORACLE_POD -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; 
do echo "\twaiting for service" && sleep 10; 
done

echo "Waiting for Oracle service to start..."
while [[ $(kubectl get services oracledb-service -o 'jsonpath={..status.loadBalancer}') == 'map[]' ]]; 
do echo "\twaiting for service" && sleep 10; 
done

echo "Is Oracle running? (TNSPING)"
kubectl exec -it $ORACLE_POD -- bash -c "tnsping XE"
while [[ $(kubectl exec -it $ORACLE_POD -- bash -c "tnsping XE" | grep OK | wc -l | awk '{print $1}') != '1' ]]; 
do 
	echo "Current TNSPING:"
	kubectl exec -it $ORACLE_POD -- bash -c "tnsping XE"
	echo "\twaiting for service" && sleep 10; 
done

# I frequently get ORA-12537: TNS:connection closed when starting too early...
# Hack: Just wait for five minutes, until Oracle is ready.
echo "Waiting another 300 seconds for services to be ready..."
sleep 300

echo ""
echo "Creating CARINSURANCE user..."
kubectl cp mainframe-oracle/create_oracle_user_carinsurance.sql $ORACLE_POD:/tmp/create_oracle_user_carinsurance.sql
kubectl exec -it $ORACLE_POD -- bash -c '/u01/app/oracle/product/11.2.0/xe/bin/sqlplus system/qwer1234@XE @/tmp/create_oracle_user_carinsurance.sql' 
echo ""
echo "Importing car insurance dump..."
kubectl cp mainframe-oracle/data_dumps/carinsurance_de_at_ch__38346_customers.oracle.dump $ORACLE_POD:/tmp/carinsurance_de_at_ch__38346_customers.oracle.dump
kubectl exec -it $ORACLE_POD -- bash -c '/u01/app/oracle/product/11.2.0/xe/bin/imp system/qwer1234@XE FROMUSER=CARINSURANCE FILE=/tmp/carinsurance_de_at_ch__38346_customers.oracle.dump' 

echo ""
echo "Creating HOMEINSURANCE user..."
kubectl cp mainframe-oracle/create_oracle_user_homeinsurance.sql $ORACLE_POD:/tmp/create_oracle_user_homeinsurance.sql
kubectl exec -it $ORACLE_POD -- bash -c '/u01/app/oracle/product/11.2.0/xe/bin/sqlplus system/qwer1234@XE @/tmp/create_oracle_user_homeinsurance.sql' 
echo ""
echo "Importing home insurance dump..."
kubectl cp mainframe-oracle/data_dumps/homeinsurance_de_at_ch__34616_customers.oracle.dump $ORACLE_POD:/tmp/homeinsurance_de_at_ch__34616_customers.oracle.dump
kubectl exec -it $ORACLE_POD -- bash -c '/u01/app/oracle/product/11.2.0/xe/bin/imp system/qwer1234@XE FROMUSER=HOMEINSURANCE FILE=/tmp/homeinsurance_de_at_ch__34616_customers.oracle.dump' 

echo ""
echo "Clean up temp files on Oracle pod..."
kubectl exec -it $ORACLE_POD -- bash -c 'rm -rf /tmp/carinsurance_de_at_ch__38346_customers.oracle.dump' 
kubectl exec -it $ORACLE_POD -- bash -c 'rm -rf /tmp/create_oracle_user_carinsurance.sql' 
kubectl exec -it $ORACLE_POD -- bash -c 'rm -rf /tmp/homeinsurance_de_at_ch__34616_customers.oracle.dump' 
kubectl exec -it $ORACLE_POD -- bash -c 'rm -rf /tmp/create_oracle_user_homeinsurance.sql' 
echo "Note: exit code 129 of the four above commands is okay (deletion of two tmp files in the container)"

echo ""
echo "Deploying MongoDB Kubernetes Operator..."
kubectl create namespace mongodb
git clone https://github.com/mongodb/mongodb-enterprise-kubernetes/
cd mongodb-enterprise-kubernetes/
git checkout tags/1.1

# We can deploy the CRDS on GCP without modification
# On OpenShift, we need to modify the MANAGED_SECURIY_CONTEXT
kubectl apply -f crds.yaml
kubectl apply -f mongodb-enterprise.yaml

echo "Create ConfigMap..."
cat > configmap.yaml << ENDOFFILE
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mdb-demo-configmap
  namespace: mongodb
data:
  projectName: $PROJECTNAME
  orgId: $ORGID
  baseUrl: $BASEURL
ENDOFFILE

kubectl apply -f configmap.yaml
sleep 20
kubectl describe configmaps mdb-demo-configmap -n mongodb

kubectl -n mongodb \
  create secret generic mdb-demo-secret \
  --from-literal="user=$USERNAME" \
  --from-literal="publicApiKey=$KEY"
sleep 20
kubectl describe secrets/mdb-demo-secret -n mongodb

cat > replicaset.yaml << ENDOFFILE
---
apiVersion: mongodb.com/v1
kind: MongoDB
metadata:
  name: insurance-replicaset
  namespace: mongodb
spec:
  members: 3
  version: 4.0.10
  type: ReplicaSet

  project: mdb-demo-configmap
  credentials: mdb-demo-secret

  persistent: true
  
  # log level affects the level of logging for the agent. Use DEBUG cautiously as log file size may grow very quickly
  logLevel: ERROR

  persistent: true
  podSpec:
    cpu: '1'
    memory: 1024M
    # "multiple" persistence allows to mount different directories to different Persistent Volumes
    persistence:
      single:
        storage: 1Gi
ENDOFFILE

kubectl apply -f replicaset.yaml

echo ""
echo "Waiting for MongoDB pods to be deployed..."
sleep 20
echo "insurance-replicaset-0"
while [[ $(kubectl get pods insurance-replicaset-0 -n mongodb -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; 
do echo "\twaiting for pod" && sleep 10; 
done
echo "insurance-replicaset-1"
while [[ $(kubectl get pods insurance-replicaset-1 -n mongodb -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; 
do echo "\twaiting for pod" && sleep 10; 
done
echo "insurance-replicaset-2"
while [[ $(kubectl get pods insurance-replicaset-2 -n mongodb -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; 
do echo "\twaiting for pod" && sleep 10; 
done

echo "Waiting another 240 seconds for services to be ready..."
sleep 240

echo ""
echo "Create an external IP to access MongoDB (note: this might be a secondary server - support for external access is available for sharded clustes and also soon for ReplicaSets in Kubernetes"

cat > external-ip.yaml << ENDOFFILE
---
kind: Service
apiVersion: v1
metadata:
  name: insurance-replicaset-external-ip-0
  namespace: mongodb
spec:
  type: LoadBalancer
  selector:
    statefulset.kubernetes.io/pod-name: insurance-replicaset-0
  ports:
  - port: 27017 # Port used to access the Service from within the cluster.
    targetPort: 27017 # Port opened by targeted Pods
---
kind: Service
apiVersion: v1
metadata:
  name: insurance-replicaset-external-ip-1
  namespace: mongodb
spec:
  type: LoadBalancer
  selector:
    statefulset.kubernetes.io/pod-name: insurance-replicaset-1
  ports:
  - port: 27017 # Port used to access the Service from within the cluster.
    targetPort: 27017 # Port opened by targeted Pods
---
kind: Service
apiVersion: v1
metadata:
  name: insurance-replicaset-external-ip-2
  namespace: mongodb
spec:
  type: LoadBalancer
  selector:
    statefulset.kubernetes.io/pod-name: insurance-replicaset-2
  ports:
  - port: 27017 # Port used to access the Service from within the cluster.
    targetPort: 27017 # Port opened by targeted Pods
ENDOFFILE

kubectl apply -f external-ip.yaml

cd ..

echo ""
echo "Deploying CDC process..."
kubectl apply -f etl-mainframe-mongodb/deployment/deployment-etl.yaml 

echo ""
echo "Deploying Mainframe Service..."
kubectl apply -f mainframe-service/deployment/mainframe-deployment.yaml
echo "Wait for Service to be ready..."
sleep 30
while [[ $(kubectl get service mainframe-service-service -o 'jsonpath={..status.loadBalancer}') == 'map[]' ]]; do echo "\twaiting for service" && sleep 10; done

echo ""
echo "Deploying Insurance Service..."
kubectl apply -f insurance-service/deployment/insurance-deployment.yaml
echo "Wait for Service to be ready..."
sleep 30
while [[ $(kubectl get service insurance-service-service -o 'jsonpath={..status.loadBalancer}') == 'map[]' ]]; do echo "\twaiting for service" && sleep 10; done

echo ""
echo "Deploying Mainframe Portal..."
SERVICE_IP_ADDRESS=$(kubectl get service | grep mainframe-service-service | awk '{print $4}')
sed -e "s#SERVICE_IP_ADDRESS#$SERVICE_IP_ADDRESS#g" mainframe-portal/deployment/deployment.yaml > mainframe-deployment.work.yaml
kubectl apply -f mainframe-deployment.work.yaml
kubectl apply -f mainframe-portal/deployment/service-gce.yaml
	
echo ""
echo "Deploying Insurance Portal..."
SERVICE_IP_ADDRESS=$(kubectl get service | grep insurance-service-service | awk '{print $4}')
sed -e "s#SERVICE_IP_ADDRESS#$SERVICE_IP_ADDRESS#g" insurance-portal/deployment/deployment.yaml > insurance-deployment.work.yaml
kubectl apply -f insurance-deployment.work.yaml
kubectl apply -f insurance-portal/deployment/service-gce.yaml 

echo ""
echo "Wait for Mainframe Portal Service..."
while [[ $(kubectl get service mainframe-portal-service -o 'jsonpath={..status.loadBalancer}') == 'map[]' ]]; do echo "\twaiting for service" && sleep 10; done

echo ""
echo "Wait for Insurance Portal Service..."
while [[ $(kubectl get service insurance-portal-service -o 'jsonpath={..status.loadBalancer}') == 'map[]' ]]; do echo "\twaiting for service" && sleep 10; done

echo ""
echo "Done. Please find the details of the demo installation below:"
echo "============================================================="
echo ""
echo "************************************** Mainframe Service: *********************************"
kubectl get service mainframe-service-service
IP=$(kubectl get service mainframe-service-service | grep mainframe-service-service | awk '{print $4}')
echo "# List of all customers:"
echo "http://$IP:8080/car/customer/all"
echo ""
echo "# Individual customer (id must exist, copy from an arbitrary customer of the /all endpoint:"
echo "http://$IP:8080/car/customer/C000014831"
echo ""
echo "# Individual policy:"
echo "http://$IP:8080/car/policy/PC_000000002"
echo "*******************************************************************************************"
echo ""
echo "************************************** Insurance Service: *********************************"
kubectl get service insurance-service-service
IP=$(kubectl get service insurance-service-service | grep insurance-service-service | awk '{print $4}')
echo "# List of all customers (paginated with 100 customers):"
echo "http://$IP:8080/customer"
echo "http://$IP:8080/customer?page=2"
echo "http://$IP:8080/customer?page=3"
echo ""
echo "# All parameters, except 'page' are transformed into a query."
echo "# Get customer with particular ID:"
echo "http://$IP:8080/customer?customer_id=C000038970"
echo "# Get customer with a particular home insurance policy:"
echo "http://$IP:8080/customer?home_insurance.policy_id=P000003753"
echo ""
echo "# List of all customers (NOT paginated):"
echo "http://$IP:8080/customer/all"
echo ""
echo "# All parameters, except 'page' are transformed into a query."
echo "# Get customer with particular ID:"
echo "http://$IP:8080/customer/all?customer_id=C000038970"
echo "# Get customer with a particular home insurance policy:"
echo "http://$IP:8080/customer/all?home_insurance.policy_id=P000003753"
echo "*******************************************************************************************"
echo ""
echo ""
echo "************************************** Mainframe Portal: *********************************"
kubectl get service mainframe-portal-service
echo "*******************************************************************************************"

echo ""
echo "************************************** Insurance Portal: *********************************"
kubectl get service insurance-portal-service
echo "*******************************************************************************************"




