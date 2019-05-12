# -*- coding: utf-8 -*-

from datetime import datetime
from dateutil.relativedelta import relativedelta
import random
import csv
import pymongo
from pymongo.errors import BulkWriteError
from faker import Factory
fake_de = Factory.create('de_DE') 
fake_at = Factory.create('de_AT') 
fake_ch = Factory.create('de_CH') 

from mimesis import Transport
transport_de = Transport(locale='de')

import sys

from sqlalchemy import create_engine
import sqlalchemy
import cx_Oracle

import logging

import pandas as pd

import os

import errno

logging.basicConfig()
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

try:
    num_gen = sys.argv[4]
except:
    num_gen = -1

if len(sys.argv) < 5 or num_gen == -1:
    print('Usage: python faker_car_insurance.py <ORACLE_HOST> <ORACLE_PORT> <ORACLE_SYSTEM_PASSWORD> <NUMBER_OF_CUSTOMERS>')
    print('Example: python faker_car_insurance.py 35.242.219.126 1521 qwer1234 500')
    exit(0)

print('Generate ' + sys.argv[4] + ' Car Insurance Customers, incl. Policies and Claims...')
print('Oracle Host: ' + sys.argv[1])
print('Oracle Port: ' + sys.argv[2])
print('Oracle Password: ' + sys.argv[3])

host=sys.argv[1] # '35.242.219.126'
carinsurance_schema='carinsurance'
port=int(sys.argv[2])
sid='xe'
user='system'
password=sys.argv[3]
sid = cx_Oracle.makedsn(host, port, sid=sid)

cstr = 'oracle://{user}:{password}@{sid}'.format(
    user=user,
    password=password,
    sid=sid
)

engine =  create_engine(
    cstr,
    convert_unicode=False,
    pool_recycle=10,
    pool_size=50
    # , echo=True
)

os.environ['NLS_LANG'] = ".AL32UTF8"

next_claim_number = 0

def main():
    num_gen = int(sys.argv[4])

    ls_dates = [fake_de.date_time_between(start_date="-10y", end_date="now", tzinfo=None) for i in range(0,num_gen)]
    ls_dates.sort()

    ls_customers = []
    customer_csvfile = open('output/customers__de_at_ch.csv', newline='\n')
    customer_reader = csv.reader(customer_csvfile, delimiter=',', quotechar='"')
    # skip header
    next(customer_reader)
    for customer in customer_reader:
        customer[9] = datetime.strptime(customer[9], '%Y-%m-%d')
        # should be 18 years or older
        customer.append(customer[9] + relativedelta(years=18))
        # no one older than 75 buys a police
        customer.append(customer[9] + relativedelta(years=75))
        ls_customers.append(customer)

    customer_csvfile.close()

    ls_policies = []
    ls_used_customer_ids = []
    ls_claims = []

    for i in range(0, num_gen - 1):
        if (i % 10000) == 0:
            print ('Batch of 10,000s: ' + str(i))
        
        s_policy_number = policy_number(i)
        d_cover_start = ls_dates[i]
        f_max_covered = random.choice([100000.0, 1000000.0, 10000000.0, 50000000.0])
        
        f_premium = 0.0
        while f_premium == 0.0:
            f_premium = random.random()
        if f_max_covered < 100000.0:
            f_premium = 500 * f_premium 
        elif f_max_covered < 100000.0:
            f_premium = 1000 * f_premium 
        elif f_max_covered < 100000.0:
            f_premium = 1500 * f_premium 
        else:
            f_premium = 2000 * f_premium 

        s_car = transport_de.car()
        
        
        s_customer_id = get_customer(i, d_cover_start, ls_customers)[0]
        if not s_customer_id in ls_used_customer_ids:
            ls_used_customer_ids.append(s_customer_id)
        ls_used_customer_ids.sort()
        
        ls_policies.append((s_policy_number, s_customer_id, d_cover_start, s_car, f_max_covered, f_premium, datetime.today()))
        
        generate_claims(s_policy_number, d_cover_start, f_max_covered, ls_claims)

        i = i+1

    ls_customers_to_db = []
    for s_customer_id in ls_used_customer_ids:
        i_customer_id = int(s_customer_id[1:]) - 1
        customer = ls_customers[i_customer_id]
        ls_customers_to_db.append((customer[0], customer[2], customer[3], customer[1], customer[4], customer[5], customer[6], customer[7], customer[8], customer[9], customer[10], customer[11], customer[12], customer[13], customer[14], datetime.today() ))

    columns_policy = ['policy_id', 'customer_id', 'cover_start', 'car_model', 'max_covered', 'last_ann_premium_gross', 'last_change']
    df_policies = pd.DataFrame(ls_policies, columns=columns_policy)
    
    columns_customer = ['customer_id', 'first_name', 'last_name', 'gender', 'job', 'email', 'phone', 'number_children', 'marital_status', 'date_of_birth', 'street', 'zip', 'city', 'country_code', 'nationality', 'last_change']
    df_customers_to_db = pd.DataFrame(ls_customers_to_db, columns=columns_customer)
    
    columns_claim = ['claim_id', 'policy_id', 'claim_date', 'settled_date', 'claim_amount', 'settled_amount', 'claim_reason', 'last_change']
    df_claims = pd.DataFrame(ls_claims, columns=columns_claim)

    delete_file('output/car_insurance_policy.csv')
    df_policies.to_csv('output/car_insurance_policy.csv', sep=',', index=False, header=columns_policy)
    df_policies.to_sql('car_policy', engine, schema=carinsurance_schema, index=False, chunksize=1000, dtype= {
            'policy_id': sqlalchemy.types.String(12),
            'customer_id': sqlalchemy.types.String(12),
            'cover_start': sqlalchemy.types.Date,
            'car_model': sqlalchemy.types.String(255),
            'max_covered': sqlalchemy.types.Numeric(precision=10, scale=2),
            'last_ann_premium_gross': sqlalchemy.types.Numeric(precision=10, scale=2),
            'last_change': sqlalchemy.dialects.oracle.TIMESTAMP
        })

    delete_file('output/car_insurance_customer.csv')
    df_customers_to_db.to_csv('output/car_insurance_customer.csv', sep=',', index=False, header=columns_customer)
    df_customers_to_db.to_sql('car_customer', engine, schema=carinsurance_schema, index=False, chunksize=1000, dtype= {
            'customer_id': sqlalchemy.types.String(12), 
            'first_name': sqlalchemy.types.String(150), 
            'last_name': sqlalchemy.types.String(150), 
            'gender': sqlalchemy.types.String(1), 
            'job': sqlalchemy.types.String(150), 
            'email': sqlalchemy.types.String(100), 
            'phone': sqlalchemy.types.String(40), 
            'number_children': sqlalchemy.types.Numeric(precision=4, scale=0),
            'marital_status': sqlalchemy.types.String(12), 
            'date_of_birth': sqlalchemy.types.Date, 
            'street': sqlalchemy.types.String(120), 
            'zip': sqlalchemy.types.String(10), 
            'city': sqlalchemy.types.String(100), 
            'country_code': sqlalchemy.types.String(2), 
            'nationality': sqlalchemy.types.String(20),
            'last_change': sqlalchemy.dialects.oracle.TIMESTAMP
       })  
    
    delete_file('output/car_insurance_claim.csv')
    df_claims.to_csv('output/car_insurance_claim.csv', sep=',', index=False, header=columns_claim)
    df_claims.to_sql('car_claim', engine, schema=carinsurance_schema, index=False, chunksize=1000, dtype= {
            'claim_id': sqlalchemy.types.String(12),
            'policy_id': sqlalchemy.types.String(12),
            'claim_date': sqlalchemy.types.Date, 
            'settled_date': sqlalchemy.types.Date, 
            'claim_amount': sqlalchemy.types.Numeric(precision=30, scale=2), 
            'settled_amount': sqlalchemy.types.Numeric(precision=30, scale=2), 
            'claim_reason': sqlalchemy.types.String(30),
            'last_change': sqlalchemy.dialects.oracle.TIMESTAMP
        })   

def policy_number(i):
    s_policy_number = str(i + 1)
    while len(s_policy_number) < 9:
        s_policy_number = '0' + s_policy_number
    s_policy_number = 'PC_' + s_policy_number

    return s_policy_number

def claim_number(i):
    s_claim_number = str(i + 1)
    while len(s_claim_number) < 9:
        s_claim_number = '0' + s_claim_number
    s_claim_number = 'CL_' + s_claim_number

    return s_claim_number

def get_customer(i, policy_date, ls_customers):
    r = random.randint(0,len(ls_customers) - 1)
    customer = ls_customers[r]
    # search backwards while the customer's birthday is not 20 years later than the policy sell date
    #                    birthday + 18                   birthday + 75
    while (policy_date < customer[-2]) or (policy_date > customer[-1]):
        if r >= 13:
            r = r - 13
            customer = ls_customers[r]
        else:
            r = len(ls_customers) - 1
            customer = ls_customers[r]

    return customer

def generate_claims(s_policy_number, d_cover_start, f_sum_insured, ls_claims):
    global next_claim_number

    num_claims = random.randint(0, 3)

    for i in range(0, num_claims):
        s_claim_number = claim_number(next_claim_number)
        next_claim_number = next_claim_number + 1

        d_claim_date = fake_de.date_between_dates(date_start=d_cover_start, date_end=datetime.today())
        d_date_settled = fake_de.date_between_dates(date_start=d_claim_date, date_end=(d_claim_date + relativedelta(months=5)))
        f_claim_amount = 0.0
        while f_claim_amount == 0.0:
            f_claim_amount = random.random()
        f_claim_amount = 10000 * f_claim_amount
        f_settled_amount = f_claim_amount if f_claim_amount <= float(f_sum_insured) else float(f_sum_insured)
        s_claim_rason = random.choice(['COLLISSION', 'HAIL', 'SCRATCH', 'OTHER'])

        ls_claims.append((s_claim_number, s_policy_number, d_claim_date, d_date_settled, f_claim_amount, f_settled_amount, s_claim_rason, datetime.today()))

def delete_file(filename):
    try:
        os.remove(filename)
    except OSError as e: 
        if e.errno != errno.ENOENT: # errno.ENOENT = no such file or directory
            raise # re-raise exception if a different error occurred

if __name__ == '__main__':
    main()
