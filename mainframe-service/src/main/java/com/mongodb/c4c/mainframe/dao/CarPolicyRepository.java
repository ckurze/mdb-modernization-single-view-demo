package com.mongodb.c4c.mainframe.dao;

import org.springframework.data.repository.CrudRepository;

import com.mongodb.c4c.mainframe.entity.CarPolicy;

public interface CarPolicyRepository extends CrudRepository<CarPolicy, String> {
	public Iterable<CarPolicy> findByCustomerId(String customerId);
}
