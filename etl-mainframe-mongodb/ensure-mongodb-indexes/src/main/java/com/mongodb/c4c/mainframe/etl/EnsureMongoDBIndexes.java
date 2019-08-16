package com.mongodb.c4c.mainframe.etl;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Indexes;

public class EnsureMongoDBIndexes {

	public static void main(String[] args) {
		if (args.length != 1) {
			System.err.println("MongoURI has to be provided as first positional argument. Will exit. No index created.");
			System.exit(1);
		}
		
		String mongoURI = args[0];
		System.out.println("Will Create Index in MongoDB with URI: " + mongoURI);
		System.out.println("Will use database collection: insurance.customer");
		
		MongoClientURI uri = new MongoClientURI(mongoURI);
		MongoClient mongo = new MongoClient(uri);
		MongoDatabase insurance = mongo.getDatabase("insurance");
		MongoCollection<Document> customer = insurance.getCollection("customer");
		String indexName = customer.createIndex(Indexes.ascending("customer_id"));
		System.out.println("Created Index: " + indexName);
		mongo.close();
	}
}
