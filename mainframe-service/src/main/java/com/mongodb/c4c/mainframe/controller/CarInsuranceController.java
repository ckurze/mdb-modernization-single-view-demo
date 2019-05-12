package com.mongodb.c4c.mainframe.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.c4c.mainframe.entity.CarClaim;
import com.mongodb.c4c.mainframe.entity.CarCustomer;
import com.mongodb.c4c.mainframe.entity.CarPolicy;
import com.mongodb.c4c.mainframe.serivce.CarInsuranceService;

@RestController
@RequestMapping("/car")
public class CarInsuranceController {

	@Autowired
	CarInsuranceService carInsuranceService;

	// ---------------------------
	// ------ Customer -----------
	// ---------------------------
	
	@RequestMapping(
    		value="/customer/{customerId}", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Optional<CarCustomer> getCustomerById(@PathVariable("customerId") String customerId) {
    		return carInsuranceService.getCarCustomerById(customerId);
    }

    @RequestMapping(
    		value="/customer/all", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<CarCustomer> getAllCustomers() {
    		return carInsuranceService.getCarCustomers();
    }

    // ---------------------------
    // -------- Policy -----------
    // ---------------------------
    
    @RequestMapping(
    		value="/policy/{policyId}", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Optional<CarPolicy> getPolicyById(@PathVariable("policyId") String policyId) {
    		return carInsuranceService.getCarPolicyByPolicyId(policyId);
    }

    @RequestMapping(
    		value="/policy/customer/{customerId}", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Iterable<CarPolicy> getPoliciesByCustomerId(@PathVariable("customerId") String customerId) {
    		return carInsuranceService.getCarPoliciesByCustomer(customerId);
    }

    @RequestMapping(
    		value = "/policy/add", 
    		method=RequestMethod.POST, 
    		consumes=MediaType.APPLICATION_JSON_VALUE, 
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public CarPolicy addNewCarPolicy(@RequestBody CarPolicy carPolicy) {
    		return carInsuranceService.addCarPolicy(carPolicy);
    }
    
    // ---------------------------
    // --------- Claim -----------
    // ---------------------------
    
    @RequestMapping(
    		value="/claim/{claimId}", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    	@ResponseBody
    	public Optional<CarClaim> getClaimById(@PathVariable("claimId") String claimId) {
    		return carInsuranceService.getCarClaimByClaimId(claimId);
    	}
    	
    @RequestMapping(
    		value="/claim/policy/{policyId}", 
    		method=RequestMethod.GET,
    		produces=MediaType.APPLICATION_JSON_VALUE)
    	@ResponseBody
    	public Iterable<CarClaim> getClaimsByPolicyId(@PathVariable("policyId") String policyId) {
    		return carInsuranceService.getCarClaimsByPolicyId(policyId);
    	}
    	
       @RequestMapping(
    		value = "/claim/add", 
    		method=RequestMethod.POST, 
    		consumes=MediaType.APPLICATION_JSON_VALUE, 
    		produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody()
    public CarClaim addNewCarClaim(@RequestBody CarClaim carClaim) {
        return carInsuranceService.addCarClaim(carClaim);
    }

}
