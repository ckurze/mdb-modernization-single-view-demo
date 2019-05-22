import React, { Component } from 'react'
import { Grid, Container } from 'semantic-ui-react'
import { createPolicy } from '../APIUtil'
import { Redirect, Link } from 'react-router-dom'
import { currentDate } from '../utils'
import { connect } from 'react-redux'
import { addCarPolicy } from '../actions'

class NewCarInsurancePolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            policy: {
                customerId: '',
                coverStart: currentDate(),
                carModel: '',
                maxCovered: '',
                lastAnnualPremiumGross: ''
            },
            policy_created: false,
            validation_errors: []
        }
    }

    handleSubmit = (event) => {
        if (this.validate() === 0) {
            console.log("Calling API with ", this.state.policy)
            createPolicy(this.state.policy)
                .then(value => {
                    this.props.dispatch(addCarPolicy(value))
                    this.setState({
                        policy: value,
                        policy_created: true
                    })
                })
                .catch(e => console.log(e))
        }
        event.preventDefault();
    }

    validate = () => {
        let validation_errors = []
        if (/C_\d*/.test(this.state.policy.customerId) === false) {
            validation_errors.push("Customer ID does not match regular expression 'C_\\d*'")
        }
        if (/\d{4}-\d{2}-\d{2}/.test(this.state.policy.coverStart) === false) {
            validation_errors.push("Cover Start does not match regular expression '\\d{4}-\\d{2}-\\d{2}'")
        }
        if (/\w+/.test(this.state.policy.carModel) === false) {
            validation_errors.push("Car Model does not match regular expression '\\w+'")
        }
        if (/\d+/.test(this.state.policy.maxCovered) === false) {
            validation_errors.push("Policy Maximum does not match regular expression '\\d+'")
        }
        if (/\d+/.test(this.state.policy.lastAnnualPremiumGross) === false) {
            validation_errors.push("Gross Premium does not match regular expression '\\d+'")
        }
        this.setState({ validation_errors })
        return validation_errors.length
    }

    handleChange = (event) => {
        console.log(event.target.id)
        let newPolicy = this.state.policy
        newPolicy[event.target.id] = event.target.value
        this.setState({ policy: newPolicy })
        this.validate()
    }

    render() {
        if (this.state.policy_created === true) {
            return <Redirect to={'/policies/'.concat(this.state.policy.policyId, "?success")} />
        }

        // policy_id and last_change will be created by server
        return (
            <div>
                <Link to='/' className="menu-link">Back to menu</Link>
                <Container className="policyForm">
                    <ul>
                        {this.state.validation_errors.map(e =>
                            <li className="validationError">{e}</li>
                        )
                        }
                    </ul>
                    <Grid container columns={2}>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="customerId">Customer ID</label></Grid.Column>
                            <Grid.Column><input type="text" id="customerId" value={this.state.policy.customerId} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="coverStart">Cover Start (YYYY-MM-DD)</label></Grid.Column>
                            <Grid.Column><input type="text" id="coverStart" value={this.state.policy.coverStart} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="carModel">Car Model</label></Grid.Column>
                            <Grid.Column><input type="text" id="carModel" value={this.state.policy.carModel} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="maxCovered">Policy Maximum (rounded to the full EURO)</label></Grid.Column>
                            <Grid.Column> <input type="text" id="maxCovered" value={this.state.policy.maxCovered} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column> <label htmlFor="lastAnnualPremiumGross">Gross Premium (rounded to the full EURO)</label></Grid.Column>
                            <Grid.Column><input type="text" id="lastAnnualPremiumGross" value={this.state.policy.lastAnnualPremiumGross} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><input type="button" onClick={this.handleSubmit} className="formSubmitButton" value="Create Policy" /></Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }

}

export default connect()(NewCarInsurancePolicy)