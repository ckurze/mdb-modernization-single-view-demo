import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchCustomers } from '../APIUtil'
import { fetchCustomersAll } from '../APIUtil'
import { addCustomers } from '../actions'

class CustomerList extends Component {

  state = {
    customerClicked: false,
    customer_id: null
  }

  componentDidMount() {
    console.log("Component did mount CustomerList", this.state);
    
    fetchCustomersAll().then((data) => {
      console.log(data);
      this.props.dispatch(addCustomers(data))
    });
  }


  render() {
    const columns = [{
      Header: 'Customer ID',
      accessor: 'customer_id',
      className: "policies-table-td"
    }, {
      Header: 'First Name',
      accessor: 'first_name',
      className: "policies-table-td"
    }, {
      Header: 'Last Name',
      accessor: 'last_name',
      className: "policies-table-td"
    }, {
      Header: 'E-Mail',
      accessor: 'email',
      className: "policies-table-td"
    }, {
      Header: 'Date of birth',
      accessor: 'date_of_birth',
      className: "policies-table-td"
    }]



    if (this.state.customerClicked === true) {
      return <Redirect push to={'/customers/'.concat(this.state.customer_id)} />
    } else return (
      <div className="policies-table -striped">
        <ReactTable
          getTrProps={(state, rowInfo, column) => {
            return {
              onClick: (e, handleOriginal) => {
                this.setState({
                  customerClicked: true,
                  customer_id: rowInfo.row.customer_id
                })
                console.log(rowInfo.row.customer_id)
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
          data={this.props.customers}
          columns={columns}
          defaultPageSize={20}
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