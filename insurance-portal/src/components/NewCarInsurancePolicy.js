import React, { Component } from 'react'
import { Button, Grid, Container } from 'semantic-ui-react'
import { createPolicy } from '../APIUtil'
import { Redirect } from 'react-router-dom'

export default class NewCarInsurancePolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            policy: {
                customer_id: '',
                cover_start: '',
                car_model: '',
                max_coverd: '',
                last_ann_premium_gross: ''
            },
            policy_created: false
        }
    }

    handleSubmit = (event) => {
        console.log("Calling API with ", this.state.policy)
        createPolicy(this.state.policy, 'motor').then(value => this.setState({
                policy: value,
                policy_created: true
            }
        ))
        event.preventDefault();
    }

    handleChange = (event) => {
        console.log(event.target.id)
        let newPolicy = this.state.policy
        newPolicy[event.target.id] = event.target.value
        this.setState({ policy: newPolicy })
    }

    render() {
        if (this.state.policy_created === true) {
            return <Redirect to={'/policies/'.concat(this.state.policy.policy_id)} />
          }

        // policy_id and last_change will be created by server
        return (
            <Container className="policyForm">
            <Grid container columns={2}>
                <Grid.Row>
                    <Grid.Column><label htmlFor="customer_id">Customer ID</label></Grid.Column>
                    <Grid.Column><input type="text" id="customer_id" value={this.state.policy.customer_id} onChange={this.handleChange} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column><label htmlFor="cover_start">Cover start</label></Grid.Column>
                    <Grid.Column><input type="text" id="cover_start" value={this.state.policy.cover_start} onChange={this.handleChange} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column><label htmlFor="customer_id">Car model</label></Grid.Column>
                    <Grid.Column><input type="text" id="car_model" value={this.state.policy.car_model} onChange={this.handleChange} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column><label htmlFor="max_coverd">max_coverd</label></Grid.Column>
                    <Grid.Column> <input type="text" id="max_coverd" value={this.state.policy.max_coverd} onChange={this.handleChange} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column> <label htmlFor="last_ann_premium_gross">last_ann_premium_gross</label></Grid.Column>
                    <Grid.Column><input type="text" id="last_ann_premium_gross" value={this.state.policy.last_ann_premium_gross} onChange={this.handleChange} /></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                <Grid.Column><Button onClick={this.handleSubmit} > Create Policy </Button></Grid.Column>
                </Grid.Row>
            </Grid>
            </Container>
        )
    }

}