

''' flask app with mongo '''
import os
import datetime
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128
from flask import Flask
from flask.json import JSONEncoder
from flask_pymongo import PyMongo


class MyEncoder(JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        elif isinstance(o, Decimal128):
            return o.to_decimal()
        else:
            return super().default(o)

# create the flask object
app = Flask(__name__)

# add mongo url to flask config, so that flask_pymongo can use it to make connection
app.config['MONGO_URI'] = os.environ.get('DB')
mongo = PyMongo(app)

# use the modified encoder class to handle ObjectId & Decimal128 object while jsonifying the response.
# Alternative would be to use bson.json_util in the controllers (this would result in extended JSON: https://docs.mongodb.com/manual/reference/mongodb-extended-json/)
app.json_encoder = MyEncoder

from app.controllers import *

