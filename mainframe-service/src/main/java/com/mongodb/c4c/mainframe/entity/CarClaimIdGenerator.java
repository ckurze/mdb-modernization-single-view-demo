package com.mongodb.c4c.mainframe.entity;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

/** Generates CL_000000001 based on car_claim Sequence */
public class CarClaimIdGenerator implements IdentifierGenerator {

	@Override
	public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
	    Connection connection = session.connection();
	    try {
	        Statement statement=connection.createStatement();

	        ResultSet rs=statement.executeQuery("select car_claim_seq.NEXTVAL as nextid from dual");

	        if(rs.next())
	        {
	            long nextid = rs.getLong(1);
	            String next = new Long(nextid).toString();
	            while (next.length() < 9) {
	            		next = "0" + next;
	            }
	            return "CL_" + next;
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return null;
	}
}
