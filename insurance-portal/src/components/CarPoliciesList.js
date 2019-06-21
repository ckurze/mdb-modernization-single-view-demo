import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Redirect } from 'react-router-dom'

class CarPoliciesList extends Component {

  state = {
    policyClicked: false,
    policy_id: null
  }

  render() {
    const columns = [{
      Header: 'Policy ID',
      accessor: 'policy_id',
      className: "policies-table-td"
    }, {
      Header: 'Customer ID',
      accessor: 'customer_id',
      className: "policies-table-td"
    }, {
      Header: 'Car Model',
      accessor: 'car_model',
      className: "policies-table-td"
    }, {
      Header: 'Last Annual Premium Gross',
      id: 'last_ann_premium_gross',
      accessor: d => Math.round(d.last_ann_premium_gross),
      className: "policies-table-td"
    }, {
      Header: 'Max Coverage',
      accessor: 'max_coverd',
      className: "policies-table-td"
    }, {
      Header: 'Last Change',
      accessor: 'last_change',
      className: "policies-table-td"
    }]



      if (this.state.policyClicked === true) {
        return <Redirect push to={'/policies/'.concat(this.state.policy_id)} />
      } else return (
      <div className="policies-table">
        <ReactTable
          getTrProps={(state, rowInfo, column) => {
            return {onClick: (e, handleOriginal) => {
              this.setState({
                policyClicked: true,
                policy_id: rowInfo.row.policy_id
              })
              console.log(rowInfo.row.policy_id)
              if (handleOriginal) {
                handleOriginal()
              }
            }
          }}}
          data={this.props.carPolicies}
          columns={columns}
          defaultPageSize={100}
        />
      </div>
    )
  }
}

export default CarPoliciesList