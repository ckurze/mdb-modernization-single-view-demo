FROM openjdk:8
WORKDIR /usr/etl-mainframe-mongodb
COPY ./MongoSyphon.jar /usr/etl-mainframe-mongodb/
COPY ./index.sh /usr/etl-mainframe-mongodb/
COPY ./car_insurance_customers_cdc.json /usr/etl-mainframe-mongodb/car_insurance_customers_cdc.json
COPY ./car_insurance_customers_cdc.json /usr/etl-mainframe-mongodb/car_insurance_customers_cdc_work.json
COPY ./car_insurance_policies_cdc.json /usr/etl-mainframe-mongodb/car_insurance_policies_cdc.json
COPY ./car_insurance_policies_cdc.json /usr/etl-mainframe-mongodb/car_insurance_policies_cdc_work.json
COPY ./home_insurance_customers_cdc.json /usr/etl-mainframe-mongodb/home_insurance_customers_cdc.json
COPY ./home_insurance_customers_cdc.json /usr/etl-mainframe-mongodb/home_insurance_customers_cdc_work.json
COPY ./home_insurance_policies_cdc.json /usr/etl-mainframe-mongodb/home_insurance_policies_cdc.json
COPY ./home_insurance_policies_cdc.json /usr/etl-mainframe-mongodb/home_insurance_policies_cdc_work.json
CMD ["sh", "/usr/etl-mainframe-mongodb/index.sh"]
