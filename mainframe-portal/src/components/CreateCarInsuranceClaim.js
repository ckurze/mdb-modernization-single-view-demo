import React, { Component } from 'react'
import { Grid, Container } from 'semantic-ui-react'
import { createClaim } from '../APIUtil'
import { Redirect, Link } from 'react-router-dom'
import { currentDate } from '../utils'
import { addCarClaim } from '../actions'
import { connect } from 'react-redux'

class CreateCarInsuranceClaim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            claim: {
                policyId: this.props.match.params.id,
                claimDate: currentDate(),
                claimAmount: '',
                settledDate: '',
                settledAmount: '',
                claimReason: ''
            },
            claim_created: false,
            validation_errors: []
        }
    }

    handleSubmit = (event) => {
        if (this.validate() === 0) {
            console.log("Calling API with ", this.state.claim)

            createClaim(this.state.claim)
                .then(value => {
                    this.setState({
                        claim: value,
                        claim_created: true
                    })
                    this.props.dispatch(addCarClaim(value))
                })
                .catch(e => console.log(e))
        }
        event.preventDefault();
    }

    validate = () => {
        let validation_errors = []
        if (/PC_\d+/.test(this.state.claim.policyId) === false) {
            validation_errors.push("Policy ID does not match regular expression 'PC_\\d+'")
        }
        if (/\d{4}-\d{2}-\d{2}/.test(this.state.claim.claimDate) === false) {
            validation_errors.push("Claim Date does not match regular expression '\\d{4}-\\d{2}-\\d{2}'")
        }
        if (/\d+/.test(this.state.claim.claimAmount) === false) {
            validation_errors.push("Claim Amount does not match regular expression '\\d+'")
        }
        if (/\d{4}-\d{2}-\d{2}/.test(this.state.claim.settledDate) === false) {
            validation_errors.push("Settled Date does not match regular expression '\\d{4}-\\d{2}-\\d{2}'")
        }
        if (/\d+/.test(this.state.claim.settledAmount) === false) {
            validation_errors.push("Settled Amount does not match regular expression '\\d+'")
        }
        if (/\w+/.test(this.state.claim.claimReason) === false) {
            validation_errors.push("Claim Reason does not match regular expression '\\w+'")
        }
        this.setState({ validation_errors })
        return validation_errors.length
    }


    handleChange = (event) => {
        console.log(event.target.id)
        let claim = this.state.claim
        claim[event.target.id] = event.target.value
        this.setState({ claim: claim })
        this.validate()
    }

    render() {
        if (this.state.claim_created === true) {
            return <Redirect to={'/claims/'.concat(this.state.claim.claimId, "?success")} />
        }

        // policy_id and last_change will be created by server
        return (
            <div>
                <Link to='/' className="menu-link">Back to menu</Link>
                <Container className="policyForm">
                    <ul>
                        {this.state.validation_errors.map(e =>
                            <li className="validationError" key={e}>{e}</li>
                        )
                        }
                    </ul>
                    <Grid container columns={2}>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="policyId">Policy ID</label></Grid.Column>
                            <Grid.Column><input type="text" id="policyId" value={this.state.claim.policyId} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="claimDate">Claim Date (YYYY-MM-DD)</label></Grid.Column>
                            <Grid.Column><input type="text" id="claimDate" value={this.state.claim.claimDate} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="claimAmount">Claim Amount (rounded to the full EURO)</label></Grid.Column>
                            <Grid.Column><input type="text" id="claimAmount" value={this.state.claim.claimAmount} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="settledDate">Settled Date (YYYY-MM-DD)</label></Grid.Column>
                            <Grid.Column> <input type="text" id="settledDate" value={this.state.claim.settledDate} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="settledAmount">Settled Amount (rounded to the full EURO)</label></Grid.Column>
                            <Grid.Column> <input type="text" id="settledAmount" value={this.state.claim.settledAmount} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><label htmlFor="claimReason">Claim Reason</label></Grid.Column>
                            <Grid.Column> <input type="text" id="claimReason" value={this.state.claim.claim_reason} onChange={this.handleChange} /></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column><input type="button" onClick={this.handleSubmit} className="formSubmitButton" value="Create Claim" /></Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}

export default connect()(CreateCarInsuranceClaim)