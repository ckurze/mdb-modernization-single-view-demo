# Data Generator for Sample Data

Please note: The subproject `mainframe-oracle` contains data dumps that can be imported directly. This project is intended, if you want to generate different data (e.g. other countries) or more data. 

## Prerequisites ##

* Python3 with installed packages:
  * Faker
  * mimesis 
  * pandas
  * pymongo
* Running Oracle 11g (e.g. express version)

## Generate Data ##

The generation of sample data is performed in three steps:
* Generate the Customers to a CSV file in the output directory
* Generate Car Insurance Data and upload into Oracle as well as CSV files in the output directory
* Generate Home Insurance Data and upload into Oracle as well as CSV files in the output directory

__1. Configure Oracle__

Connect to Oracle, e.g. via SQLDeveloper, using the EXTERNAL-IP of the oracledb-service outlined above on PORT 1521. Username is ```system```, the password is ```qwer1234``` (as defined in ```mainframe-oracle/deployment/oracle-pass-secret.yaml```). 

![gke-settings-oracle](doc/gke-settings-oracle.png)

Execute the following commands in SQLDeveloper that will create two users/schemas in Oracle for car and home insurance, respectively:

```
CREATE USER carinsurance IDENTIFIED BY carinsurance;
CREATE USER homeinsurance IDENTIFIED BY homeinsurance;

GRANT ALL PRIVILEGES TO carinsurance;
GRANT ALL PRIVILEGES TO homeinsurance;
```

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

__2. Generate Data__

The following commands need to be executed to generate the data and load it into Oracle (there will also be a CSV version of the data in the ```output``` directory):
```
cd mainframe-dataloader/

# We recommend to generate 80k customers to have a meaningful example. For smaller demonstration purposes, it can be less.
python faker_customers_to_csv.py 80000

# Generate Car Insurance (Schema: CARINSURANCE, Password: carinsurance)
# Usage: python faker_car_insurance.py <ORACLE_HOST> <ORACLE_PORT> <ORACLE_SYSTEM_PASSWORD> <NUMBER_OF_CUSTOMERS>
# Note: Due to the internal selection of customers (birth dates should match the insurance start date, etc.) the actual number
#       of generated customers can be lower than the number provided here, so please add a buffer of 25%.
python faker_car_insurance.py ORACLE_IP 1521 qwer1234 50000

# Generate Home Insurance (Schema: HOMEINSURANCE, Password: homeinsurance)
# Usage: python faker_home_insurance.py <ORACLE_HOST> <ORACLE_PORT> <ORACLE_SYSTEM_PASSWORD> <NUMBER_OF_CUSTOMERS_MAX_256136>
# Note: Due to the internal selection of customers (birth dates should match the insurance start date, etc.) the actual number
#       of generated customers can be lower than the number provided here, so please add a buffer of 25%.
#       The maximum number is 256136, as the file home_insurance.csv is taken as a basis and it contains 256136 rows.
python faker_home_insurance.py ORACLE_IP 1521 qwer1234 50000
```
__3 Apply SQL Triggers and Key Constraints__

Create Primary and Foregin Keys as well as Triggers in Oracle to reflect Change Data Capture.
Execute the SQL code provided in ```mainframe-oracle/home_insurance_oracle_triggers_and_keys.sql``` as well as ```mainframe-oracle/car_insurance_oracle_triggers_and_keys.sql```. These scripts will create triggers that update the last_change timestamp for each insert or update as well as foreign keys for the sake of completeness.
