ALTER TABLE CARINSURANCE.CAR_CLAIM ADD CONSTRAINT PK_CAR_CLAIM PRIMARY KEY (CLAIM_ID);
ALTER TABLE CARINSURANCE.CAR_CUSTOMER ADD CONSTRAINT PK_CAR_CUSTOMER PRIMARY KEY (CUSTOMER_ID);
ALTER TABLE CARINSURANCE.CAR_POLICY ADD CONSTRAINT PK_CAR_POLICY PRIMARY KEY (POLICY_ID);

ALTER TABLE CARINSURANCE.CAR_CLAIM ADD CONSTRAINT FK_C_CLAIM_POLICY FOREIGN KEY (POLICY_ID) REFERENCES CARINSURANCE.CAR_POLICY (POLICY_ID);
ALTER TABLE CARINSURANCE.CAR_POLICY ADD CONSTRAINT FK_C_POLICY_CUSTOMER FOREIGN KEY (CUSTOMER_ID) REFERENCES CARINSURANCE.CAR_CUSTOMER (CUSTOMER_ID);
