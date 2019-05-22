import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchCustomers } from '../APIUtil'
import { addCustomers } from '../actions'

class CustomerList extends Component {

  state = {
    loading: true
  }

  componentDidMount() {
    fetchCustomers().then((data) => {
      console.log(data);
      this.props.dispatch(addCustomers(data))
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customers) {
      this.setState(
        {
          ...this.state,
          loading: false
        }
      )
    }
  }

  render() {
    const columns = [{
      Header: 'Customer ID',
      accessor: 'customerId',
      className: "policies-table-td"
    }, {
      Header: 'First Name',
      accessor: 'firstName',
      className: "policies-table-td"
    }, {
      Header: 'Last Name',
      accessor: 'lastName',
      className: "policies-table-td"
    }, {
      Header: 'Gender',
      accessor: 'gender',
      className: "policies-table-td"
    }, {
      Header: 'E-Mail',
      accessor: 'email',
      className: "policies-table-td"
    }, {
      Header: 'Date of birth',
      accessor: 'dateOfBirth',
      className: "policies-table-td"
    }]

    if (this.state.loading) {
      return (
        <div>
          <Link to='/' className="menu-link">Back to menu</Link>
          <div className="loading" />
        </div>
      )
    }

    return (
      <div className="policies-table">
        <Link to='/' className="menu-link">Back to menu</Link>
        <ReactTable
          data={this.props.customers}
          columns={columns}
          defaultPageSize={100}
        />
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