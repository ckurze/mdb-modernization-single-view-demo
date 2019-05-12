package com.mongodb.c4c.mainframe.serivce;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.c4c.mainframe.dao.CarClaimRepository;
import com.mongodb.c4c.mainframe.dao.CarCustomerRepository;
import com.mongodb.c4c.mainframe.dao.CarPolicyRepository;
import com.mongodb.c4c.mainframe.entity.CarClaim;
import com.mongodb.c4c.mainframe.entity.CarCustomer;
import com.mongodb.c4c.mainframe.entity.CarPolicy;

@Service
public class CarInsuranceService {

	@Autowired
	CarCustomerRepository carCustomerRepository;
	
	@Autowired
	CarPolicyRepository carPolicyRepository;
	
	@Autowired
	CarClaimRepository carClaimRepository;
	
	public Iterable<CarCustomer> getCarCustomers() {
		return carCustomerRepository.findAll();
	}
	
	public Optional<CarCustomer> getCarCustomerById(String customerId) {
		return carCustomerRepository.findById(customerId);
	}
	
	public Iterable<CarPolicy> getCarPoliciesByCustomer(String customerId) {
		return carPolicyRepository.findByCustomerId(customerId);
	}
	
	public Optional<CarPolicy> getCarPolicyByPolicyId(String policyId) {
		return carPolicyRepository.findById(policyId);
	}
	
	public Iterable<CarClaim> getCarClaimsByPolicyId(String policyId) {
		return carClaimRepository.findByPolicyId(policyId);
	}

	public CarPolicy addCarPolicy(CarPolicy carPolicy) {
		return carPolicyRepository.save(carPolicy);
	}
	
	public Optional<CarClaim> getCarClaimByClaimId(String claimId) {
		return carClaimRepository.findById(claimId);
	}
	
	public CarClaim addCarClaim(CarClaim carClaim) {
		return carClaimRepository.save(carClaim);
	}
}
