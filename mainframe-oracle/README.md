# Relational Source Data

Content of this subproject:
* Deployment of Oracle into Kubernetes Cluster (ephemeral and persistent)
* Primary and Foreign Key constraints  
* Scripts to create users for automated deployments
* Sample Data Dumps for fast and easy setup

__1. Install Mainframe / Oracle__

Create a secret that contains the `system` password for Oracle. Change it in `mainframe-oracle/deployment/oracle-pass-secret.yaml` (defaults to `qwer1234`) and create the secret via:
```
kubectl apply -f mainframe-oracle/deployment/oracle-pass-secret.yaml
```

In order to install Oracle, we provide two mechanisms. The first one uses ephemeral storage, i.e. as soon as the Oracle pod is killed, all the data will be removed. Using persistent volume claims in the second option, data will be available after pod restarts.

__1.1 Option 1: Create Ephemeral Oracle Instance in Kubernetes__

The insurance core system runs on Oracle today. The demo will use a containerized version. It can be installed as following (be sure to create the secret first, as outline above):
```
kubectl apply -f mainframe-oracle/deployment/ephemeral/oracle-deployment.yaml 
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

__1.2 Option 2: Create Persistent Oracle Instance in Kubernetes__

The insurance core system runs on Oracle today. The demo will use a containerized version which uses a statefulSet with a persistent volume. It can be installed as following (be sure to create the secret first, as outline above):

```
kubectl apply -f mainframe-oracle/deployment/persistent/oracle-deployment.yaml 
```

Double-check that the pods and service have been created:
```
kubectl get all
pod/oracledb-774446f779-pr9lf    1/1     Running   0          102s

NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)          AGE
service/kubernetes          ClusterIP      10.55.240.1     <none>         443/TCP          51m
service/oracledb-service    LoadBalancer   10.55.245.171   <pending>      1521:30371/TCP   102s

NAME                        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/oracledb    1         1         1            1           102s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/oracledb-774446f779    1         1         1       102s
```

__1.2 Create the Schemata in Oracle for Car and Home Insurance__

Please see the `data-generator` directory for additional information how to generate data into Oracle.

__1.3 Create Constraints__

Create Primary and Foregin Keys as well as Triggers in Oracle to reflect Change Data Capture.
Execute the SQL code provided in ```home_insurance_oracle_triggers_and_keys.sql``` as well as ```car_insurance_oracle_triggers_and_keys.sql```. These scripts will create triggers that update the last_change timestamp for each insert or update as well as foreign keys for the sake of completeness.
