# Data Dumps for fast setup of the demo

## Oracle
Data for Car and Home Insurances is available.

### Germany/Austria/Switzerland:

**Car Insurance:**

* Customers: 38346
* Policies: 79999
* Claims: 120127

**Home Insurance:**

* Customers: 34616
* Polices: 59358
* Claims: 106910

**Overlapping Customers with Car and Home Insurance:** 

* Overlapping Customers: 19974

**Creation Details**
The data has been generated via the mainframe-dataloader subproject into Oracle. The dump has been exported with the following commands:

```
/u01/app/oracle/product/11.2.0/xe/bin/exp system/qwer1234@XE OWNER=CARINSURANCE FILE=~/carinsurance_de_at_ch__38346_customers.oracle.dump

/u01/app/oracle/product/11.2.0/xe/bin/exp system/qwer1234@XE OWNER=HOMEINSURANCE FILE=~/homeinsurance_de_at_ch__34616_customers.oracle.dump
```

The dump can be imported with the following commands and expects that the users have been created in advance:
```
#Create Users:
/u01/app/oracle/product/11.2.0/xe/bin/sqlplus system/qwer1234@XE <<EOF
CREATE USER carinsurance IDENTIFIED BY carinsurance;
GRANT ALL PRIVILEGES TO carinsurance;
CREATE USER homeinsurance IDENTIFIED BY homeinsurance;
GRANT ALL PRIVILEGES TO homeinsurance;
EOF

#Import carinsurance:
/u01/app/oracle/product/11.2.0/xe/bin/imp system/qwer1234@XE FROMUSER=CARINSURANCE FILE=~/carinsurance_de_at_ch__38346_customers.oracle.dump

#Import homeinsurance:
/u01/app/oracle/product/11.2.0/xe/bin/imp system/qwer1234@XE FROMUSER=HOMEINSURANCE FILE=~/homeinsurance_de_at_ch__34616_customers.oracle.dump
```