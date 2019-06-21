from datetime import datetime
from dateutil.relativedelta import relativedelta
import random
import csv
import sys
from faker import Factory
fake_de = Factory.create('de_DE') 
fake_at = Factory.create('de_AT') 
fake_ch = Factory.create('de_CH') 

from mimesis import Person, Address
import mimesis.enums

import logging

import pandas as pd


def main():

    try:
        num_gen = int(sys.argv[1])
    except:
        num_gen = -1

    if len(sys.argv) < 2 or num_gen == -1:
        print("Usage: python faker_customers_to_csv.py <INT: Number of Customers to generate>")
        print("Exymple: python faker_customers_to_csv.py 10000")
        return

    # Generate Customers that are between 18 and 100 years old
    ls_dates = [fake_de.date_time_between(start_date="-100y", end_date="-18y", tzinfo=None) for i in range(0,num_gen)]
    ls_dates.sort()

    ls_customer = []
    for i in range(0, len(ls_dates)):
        s_country = random_country()
        address = None
        person = None
        s_nationality = None
        if s_country == 'DE':
            address = Address('de')
            person = Person('de')
            s_nationality = 'Germany'
        elif s_country == 'AT':
            address = Address('de-at')
            person = Person('de-at')
            s_nationality = 'Austria'
        else:
            address = Address('de-ch')
            person = Person('de-ch')
            s_nationality = 'Switzerland'

        s_sex = random_mf_flag()
        gender = mimesis.enums.Gender.FEMALE if s_sex == 'F' else mimesis.enums.Gender.MALE
        s_first_name = person.name(gender)
        s_last_name = person.last_name(gender)
        s_marital_status = random_marital_status_flag()
        s_job = person.occupation()
        s_email = person.email()
        s_phone = person.telephone()
        i_number_children = random.randint(0,4)
        s_address_street = address.address()
        s_address_zip = address.postal_code()
        s_address_city = address.city()
        
        t_customer = (customer_number(i), s_sex, s_first_name, s_last_name, s_job, s_email, s_phone, i_number_children, s_marital_status, ls_dates[i].replace(hour=0, minute=0, second=0, microsecond=0), s_address_street, s_address_zip, s_address_city, s_country, s_nationality)
        ls_customer.append(t_customer)

    ls_columns=['customer_id', 'gender', 'first_name', 'last_name', 'job', 'email', 'phone', 'number_children', 'marital_status', 'date_of_birth', 'street', 'zip', 'city', 'country_code', 'nationality']

    df_customer = pd.DataFrame(ls_customer, columns=ls_columns)
    
    df_customer.to_csv('output/customers__de_at_ch.csv', sep=',', index=False, header=ls_columns)
    

def customer_number(i):
    s_customer_number = str(i + 1)
    while len(s_customer_number) < 9:
        s_customer_number = '0' + s_customer_number
    s_customer_number = 'C' + s_customer_number

    return s_customer_number

def random_mf_flag():
    r = random.randint(0,100)
    if r % 2 == 0:
        return 'M'

    return 'F'

def random_marital_status_flag():
    r = random.randint(0,100)
    if r % 4 == 0:
        return 'SINGLE'
    elif r % 4 == 1:
        return 'MARRIED'
    elif r % 4 == 2:
        return 'DIVORCED'

    return 'WIDOWED'



def random_country():
    r = random.randint(0,100)
    if r % 3 == 0:
        return 'DE'
    elif r % 3 == 1:
        return 'AT'

    return 'CH'


if __name__ == '__main__':
    main()
