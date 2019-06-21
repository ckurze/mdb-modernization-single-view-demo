import React, { Component } from 'react'
import 'react-table/react-table.css'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class CustomerList extends Component {

  state = {
    customerClicked: false,
    customer_id: null
  }

  componentDidMount() {
    console.log("Component did mount ", this.state);
  }

  handleChange = (event) => {
    console.log(event.target.id, event.target.value)
    this.setState({ customer_id: event.target.value })
  }

  handleSubmit = (event) => {
    this.setState({
      customer_id: this.state.customer_id,
      customerClicked: true
    })
    event.preventDefault();
  }

  render() {


    if (this.state.customerClicked === true) {
      return <Redirect push to={'/customers/'.concat(this.state.customer_id)} />
    } else return (
      <div className="customerLookupContainer">
        Please enter Customer ID: <input type="text" onChange={this.handleChange} />
        <div>
          <input type="button" onClick={this.handleSubmit} className="formSubmitButton" value="Go to customer details" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    customers: state.customers
  }
}

export default connect(mapStateToProps)(CustomerList);