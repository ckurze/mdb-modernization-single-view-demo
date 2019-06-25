#!/bin/bash
while true
do
	echo "Press CTRL+C to stop the script execution"
	
	# Prepare the car insurance customer CDC process with environment variables.	
	rm car_insurance_customers_cdc_work.json
	sed -e "s#MONGO_URI#$MONGO_URI#g" -e "s#ORACLE_URI#$ORACLE_URI#g" car_insurance_customers_cdc.json > car_insurance_customers_cdc_work.json
	java -jar MongoSyphon.jar -c car_insurance_customers_cdc_work.json

	# Prepare the car insurance policies and claim CDC process with environment variables.	
	rm car_insurance_policies_cdc_work.json
	sed -e "s#MONGO_URI#$MONGO_URI#g" -e "s#ORACLE_URI#$ORACLE_URI#g" car_insurance_policies_cdc.json > car_insurance_policies_cdc_work.json
	java -jar MongoSyphon.jar -c car_insurance_policies_cdc_work.json

	# Prepare the home insurance customer CDC process with environment variables.	
	rm home_insurance_customers_cdc_work.json
	sed -e "s#MONGO_URI#$MONGO_URI#g" -e "s#ORACLE_URI#$ORACLE_URI#g" home_insurance_customers_cdc.json > home_insurance_customers_cdc_work.json
	java -jar MongoSyphon.jar -c home_insurance_customers_cdc_work.json

	# Prepare the car insurance policies and claim CDC process with environment variables.	
	rm home_insurance_policies_cdc_work.json
	sed -e "s#MONGO_URI#$MONGO_URI#g" -e "s#ORACLE_URI#$ORACLE_URI#g" home_insurance_policies_cdc.json > home_insurance_policies_cdc_work.json
	java -jar MongoSyphon.jar -c home_insurance_policies_cdc_work.json

	sleep 10s
done
