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
@Table(name="CAR_CLAIM")
public class CarClaim {

	@Column(name="CLAIM_ID", length=12)
	@Id
    @GenericGenerator(name = "car_claim_id", strategy = "com.mongodb.c4c.mainframe.entity.CarClaimIdGenerator")
    @GeneratedValue(generator = "car_claim_id")  
	private String claimId;
	
	@Column(name="POLICY_ID", length=12)
	private String policyId;
	
	@Column(name="CLAIM_DATE")
	private Date claimDate;
	
	@Column(name="SETTLED_DATE")
	private Date settledDate;
	
	@Column(name="CLAIM_AMOUNT", precision=30, scale=2)
	private Double claimAmount;
	
	@Column(name="SETTLED_AMOUNT", precision=30, scale=2)
	private Double settledAmount;
	
	@Column(name="CLAIM_REASON", length=30)
	private String claimReason;
	
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
	
	public CarClaim() {}

	public String getClaimId() {
		return claimId;
	}


	public void setClaimId(String claimId) {
		this.claimId = claimId;
	}


	public String getPolicyId() {
		return policyId;
	}


	public void setPolicyId(String policyId) {
		this.policyId = policyId;
	}


	public Date getClaimDate() {
		return claimDate;
	}


	public void setClaimDate(Date claimDate) {
		this.claimDate = claimDate;
	}


	public Date getSettledDate() {
		return settledDate;
	}


	public void setSettledDate(Date settledDate) {
		this.settledDate = settledDate;
	}


	public Double getClaimAmount() {
		return claimAmount;
	}


	public void setClaimAmount(Double claimAmount) {
		this.claimAmount = claimAmount;
	}


	public Double getSettledAmount() {
		return settledAmount;
	}


	public void setSettledAmount(Double settledAmount) {
		this.settledAmount = settledAmount;
	}


	public String getClaimReason() {
		return claimReason;
	}


	public void setClaimReason(String claimReason) {
		this.claimReason = claimReason;
	}


	public Timestamp getLastChange() {
		return lastChange;
	}


	public void setLastChange(Timestamp lastChange) {
		this.lastChange = lastChange;
	}
	
}
