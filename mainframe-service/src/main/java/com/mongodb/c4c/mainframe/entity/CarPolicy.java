package com.mongodb.c4c.mainframe.entity;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="CAR_POLICY")
public class CarPolicy {

	@Column(name="POLICY_ID", length=12)
	@Id
    @GenericGenerator(name = "car_policy_id", strategy = "com.mongodb.c4c.mainframe.entity.CarPolicyIdGenerator")
    @GeneratedValue(generator = "car_policy_id")  
	private String policyId;
	
	@Column(name="CUSTOMER_ID", length=12)
	private String customerId;
	
	@Column(name="COVER_START")
	private Date coverStart;
	
	@Column(name="CAR_MODEL", length=255)
	private String carModel;
	
	@Column(name="MAX_COVERED", precision=10, scale=2)
	private Double maxCovered;
	
	@Column(name="LAST_ANN_PREMIUM_GROSS", precision=10, scale=2)
	private Double lastAnnualPremiumGross;
	
	@Column(name="LAST_CHANGE")
	private Timestamp lastChange;
	
	@PrePersist
	protected void onCreate() {
		lastChange = new Timestamp(System.currentTimeMillis());
	}

	@PreUpdate
	protected void onUpdate() {
		lastChange = new Timestamp(System.currentTimeMillis());
	}
	
	public CarPolicy() {}

	public String getPolicyId() {
		return policyId;
	}

	public void setPolicyId(String policyId) {
		this.policyId = policyId;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public Date getCoverStart() {
		return coverStart;
	}

	public void setCoverStart(Date coverStart) {
		this.coverStart = coverStart;
	}

	public String getCarModel() {
		return carModel;
	}

	public void setCarModel(String carModel) {
		this.carModel = carModel;
	}

	public Double getMaxCovered() {
		return maxCovered;
	}

	public void setMaxCovered(Double maxCovered) {
		this.maxCovered = maxCovered;
	}

	public Double getLastAnnualPremiumGross() {
		return lastAnnualPremiumGross;
	}

	public void setLastAnnualPremiumGross(Double lastAnnualPremiumGross) {
		this.lastAnnualPremiumGross = lastAnnualPremiumGross;
	}

	public Timestamp getLastChange() {
		return lastChange;
	}

	public void setLastChange(Timestamp lastChange) {
		this.lastChange = lastChange;
	}	

}
