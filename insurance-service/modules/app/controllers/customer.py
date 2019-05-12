''' controller and routes for users '''
import os
from flask import request, jsonify
# If we want to work with $oid and $numberDecimal, we should use json_util of PyMongo
# The output would be realized with: 
# data = mongo.db[COLLECTION].find_one(query)
# return jsonify(json_util.dumps(data)), 200
# But: Here, we want to work with standard JSON datatypes for easier usage in web services.
#from bson import json_util

from app import app, mongo

COLLECTION = 'customer'


# We want to get customers by now, no changes supported yet.
# Streaming of large results can be achieved as described here: https://blog.al4.co.nz/2016/01/streaming-json-with-flask/
@app.route('/customer', methods=['GET']) # , 'POST', 'DELETE', 'PATCH'])
def customer():
    if request.method == 'GET':
        query = request.args.copy()
        page = request.args.get('page', 1, type=int)
        customers_per_page = 100
        query.pop('page', 1)

        data = [doc for doc in mongo.db[COLLECTION].find(query).sort('customer_id', 1).skip((page - 1)*customers_per_page).limit(customers_per_page)]
        return jsonify(data), 200

#    data = request.get_json()
#    if request.method == 'POST':
#        if data.get('name', None) is not None and data.get('email', None) is not None:
#            mongo.db[COLLECTION].insert_one(data)
#            return jsonify({'ok': True, 'message': 'User created successfully!'}), 200
#        else:
#            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

#    if request.method == 'DELETE':
#        if data.get('email', None) is not None:
#            db_response = mongo.db[COLLECTION].delete_one({'email': data['email']})
#            if db_response.deleted_count == 1:
#                response = {'ok': True, 'message': 'record deleted'}
#            else:
#                response = {'ok': True, 'message': 'no record found'}
#            return jsonify(response), 200
#        else:
#            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400

#    if request.method == 'PATCH':
#        if data.get('query', {}) != {}:
#            mongo.db[COLLECTION].update_one(
#                data['query'], {'$set': data.get('payload', {})})
#            return jsonify({'ok': True, 'message': 'record updated'}), 200
#        else:
#            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400
