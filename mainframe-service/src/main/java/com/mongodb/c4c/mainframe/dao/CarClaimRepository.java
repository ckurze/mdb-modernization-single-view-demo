package com.mongodb.c4c.mainframe.dao;

import org.springframework.data.repository.CrudRepository;

import com.mongodb.c4c.mainframe.entity.CarClaim;

public interface CarClaimRepository extends CrudRepository<CarClaim, String> {
	public Iterable<CarClaim> findByPolicyId(String policyId);
}
