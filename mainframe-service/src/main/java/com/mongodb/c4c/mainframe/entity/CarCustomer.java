package com.mongodb.c4c.mainframe.entity;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

@Entity
@Table(name="CAR_CUSTOMER")
public class CarCustomer {

	@Column(name="CUSTOMER_ID", length=12)
	@Id
    private String customerId;
	
	@Column(name="FIRST_NAME", length=150)
	private String firstName;
	
	@Column(name="LAST_NAME", length=150)
	private String lastName;
	
	@Column(name="GENDER", length=1)
	private String gender;
	
	@Column(name="JOB", length=150)
	private String job;
	
	@Column(name="EMAIL", length=100)
	private String email;
	
	@Column(name="PHONE", length=40)
	private String phone;
	
	@Column(name="NUMBER_CHILDREN", precision=4, scale=0)
	private Integer numberChildren;
	
	@Column(name="MARITAL_STATUS", length=12)
	private String maritalStatus;
	
	@Column(name="DATE_OF_BIRTH")
	private Date dateOfBirth;
	
	@Column(name="STREET", length=120)
	private String street;
	
	@Column(name="ZIP", length=10)
	private String zip;
	
	@Column(name="CITY", length=100)
	private String city;
	
	@Column(name="COUNTRY_CODE", length=2)
	private String countryCode;
	
	@Column(name="NATIONALITY", length=20)
	private String nationality;
	
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
	
	public CarCustomer() {}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getNumberChildren() {
		return numberChildren;
	}

	public void setNumberChildren(Integer numberChildren) {
		this.numberChildren = numberChildren;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public Timestamp getLastChange() {
		return lastChange;
	}

	public void setLastChange(Timestamp lastChange) {
		this.lastChange = lastChange;
	}
	
}
