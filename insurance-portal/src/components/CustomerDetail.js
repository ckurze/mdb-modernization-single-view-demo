import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCustomer } from './../APIUtil';
import { addCustomer } from './../actions';
import { Redirect } from 'react-router-dom'

class CustomerDetail extends Component {

    state = {
        loading: true
    }

    handleSubmit = (event) => {
        fetchCustomer(this.props.match.params.id).then((data) => {
            console.log(data[0]);
            this.props.dispatch(addCustomer(data))
            this.setState({ loading: false })
        }).catch(() => {
            console.log("error fetching customer, this.props customer is undefined ");
            this.setState({ loading: false })
        });
    }

    componentDidMount() {
        console.log("CustomerDetail componentDidMount fetching customer", this.props.match.params.id)
        fetchCustomer(this.props.match.params.id).then((data) => {
            console.log(data);
            this.props.dispatch(addCustomer(data[0]))
            this.setState({ loading: false })
        }).catch(() => {
            console.log("error fetching customer, this.props customer is undefined ");
            this.setState({ loading: false })
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps)
        if (nextProps.customer) {
            this.setState({ loading: false })
        }
    }

    renderCarPolicy = carPolicy => (
        <div className="tile contact policy-tile" key={carPolicy.policy_id}>
            <div className="header">Car Insurance</div>
            <div className="row"><div className="key">Car policy ID</div><div className="value forty-margin">{carPolicy.policy_id}</div></div>
            <div className="row"><div className="key">Car model</div><div className="value forty-margin">{carPolicy.car_model}</div></div>
            <div className="row"><div className="key">Cover Start</div><div className="value forty-margin">{carPolicy.cover_start}</div></div>
            <div className="row"><div className="key">Annual premium</div><div className="value forty-margin">{carPolicy.last_ann_premium_gross}</div></div>
            <div className="row"><div className="key">Max Damage Covered</div><div className="value forty-margin">{carPolicy.max_coverd}</div></div>
        </div>)

    renderCarClaim = carClaim => (
        <div className="tile contact claim-tile" key={carClaim.claim_date}>
            <div className="header">Claim</div>
            <div className="row"><div className="key">Claim Date</div><div className="value forty-margin">{carClaim.claim_date}</div></div>
            <div className="row"><div className="key">Claim Reason </div><div className="value forty-margin">{carClaim.claim_reason}</div></div>
            <div className="row"><div className="key">Claim Amount</div><div className="value forty-margin">{carClaim.claim_amount}</div></div>
            <div className="row"><div className="key">Settled Date</div><div className="value forty-margin">{carClaim.settled_date}</div></div>
            <div className="row"><div className="key">Settled Amount</div><div className="value forty-margin">{carClaim.settled_amount}</div></div>
        </div>
    )

    renderHomePolicy = homePolicy => (
        <div className="tile contact policy-tile" key={homePolicy.policy_id}>
            <div className="header">Home Insurance</div>
            <div className="row"><div className="key">Home policy ID</div><div className="value forty-margin">{homePolicy.policy_id}</div></div>
            <div className="row"><div className="key">Status</div><div className="value forty-margin">{homePolicy.policy_status}</div></div>
            <div className="row"><div className="key">Cover Start</div><div className="value forty-margin">{homePolicy.cover_start}</div></div>
            <div className="row"><div className="key">Annual premium</div><div className="value forty-margin">{homePolicy.last_annual_premium_gross}</div></div>
            <div className="row"><div className="key">Coverage</div>
                {homePolicy.coverage.map(e => <div className="value forty-margin" key={e.type}>{e.type}</div>)}</div>
        </div>)

    renderHomeClaim = homeClaim => (
        <div className="tile contact claim-tile" key={homeClaim.claim_date}>
            <div className="header">Claim</div>
            <div className="row"><div className="key">Claim date</div><div className="value forty-margin">{homeClaim.claim_date}</div></div>
            <div className="row"><div className="key">Claim Reason </div><div className="value forty-margin">{homeClaim.claim_reason}</div></div>
            <div className="row"><div className="key">Claim Amount</div><div className="value forty-margin">{homeClaim.claim_amount}</div></div>
            <div className="row"><div className="key">Type</div><div className="value forty-margin">{homeClaim.claim_type}</div></div>
            <div className="row"><div className="key">Settled Date</div><div className="value forty-margin">{homeClaim.settled_date}</div></div>
            <div className="row"><div className="key">Settled Amount</div><div className="value forty-margin">{homeClaim.settled_amount}</div></div>
        </div>
    )

    render() {
        if (this.state.loading) return (<div>Loading</div>)

        if (this.props.customer === undefined) {
            console.log("CustomerDetail render, this.props.customer is ", this.props.customer)
            return (<Redirect to={'/customer-lookup?error'} />)
        }

        console.log("CustomerDetail render, this.props.customer is ", this.props.customer)
        let items = []
        if (this.props.customer.car_insurance) {
            for (let i = 0; i < this.props.customer.car_insurance.length; i++) {
                items.push(this.renderCarPolicy(this.props.customer.car_insurance[i]))
                if (this.props.customer.car_insurance[i].claim) {
                    for (let j = 0; j < this.props.customer.car_insurance[i].claim.length; j++) {
                        items.push(this.renderCarClaim(this.props.customer.car_insurance[i].claim[j]))
                    }
                }
            }
        }

        if (this.props.customer.home_insurance) {
            for (let i = 0; i < this.props.customer.home_insurance.length; i++) {
                items.push(this.renderHomePolicy(this.props.customer.home_insurance[i]))
                if (this.props.customer.home_insurance[i].claim) {
                    for (let j = 0; j < this.props.customer.home_insurance[i].claim.length; j++) {
                        items.push(this.renderHomeClaim(this.props.customer.home_insurance[i].claim[j]))
                    }
                }
            }
        }

        return (

            <div className="customer-detail-container">
                <div>
                    <input type="button" onClick={this.handleSubmit} className="formSubmitButton" value="Refresh" />
                </div>
                <div className="tile">
                    <div className="header">Demographics</div>
                    <div className="row"><div className="key">Customer ID</div><div className="value thirty-margin">{this.props.customer.customer_id}</div></div>
                    <div className="row"><div className="key">Salutation</div><div className="value thirty-margin">{this.props.customer.salutation === 'F' ? 'Mrs.' : 'Mr.'}</div></div>
                    <div className="row"><div className="key">Name</div><div className="value thirty-margin">{this.props.customer.first_name} {this.props.customer.last_name}</div></div>
                    <div className="row"><div className="key">Marital Status</div><div className="value thirty-margin">{this.props.customer.marital_status}</div></div>
                    <div className="row"><div className="key">Job</div><div className="value thirty-margin">{this.props.customer.job}</div></div>
                    <div className="row"><div className="key">Nationality</div><div className="value thirty-margin">{this.props.customer.address.nationality}</div></div>
                </div>

                <div className="tile contact">
                    <div className="header">Contact Information</div>
                    <div className="row"><div className="key">Email</div><div className="value thirty-margin">{this.props.customer.email}</div></div>
                    <div className="row"><div className="key">Phone</div><div className="value thirty-margin">{this.props.customer.phone}</div></div>
                    <div className="row"><div className="key">Street</div><div className="value thirty-margin">{this.props.customer.first_name} {this.props.customer.address.street}</div></div>
                    <div className="row"><div className="key">ZIP Code</div><div className="value thirty-margin">{this.props.customer.address.zip}</div></div>
                    <div className="row"><div className="key">City</div><div className="value thirty-margin">{this.props.customer.address.city}</div></div>
                </div>


                {
                    items
                }

            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    let newProps = {
        customer: state.customers.find(e => e.customer_id === ownProps.match.params.id),
        customer_id: ownProps.match.params.id
    }

    if (newProps.customer !== undefined) {
        console.log("CustomerDetail mapStateToProps, customer is ", newProps.customer.customer_id)
        return newProps
    } else {
        console.log("CustomerDetail mapStateToProps, customer is undefined")
        return {}
    }


}

export default connect(mapStateToProps)(CustomerDetail)