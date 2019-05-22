import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Redirect } from 'react-router-dom'

class CarPoliciesList extends Component {

  state = {
    policyClicked: false,
    policyId: null
  }

  render() {
    const columns = [{
      Header: 'Policy ID',
      accessor: 'policyId',
      className: "policies-table-td"
    }, {
      Header: 'Customer ID',
      accessor: 'customerId',
      className: "policies-table-td"
    }, {
      Header: 'Car Model',
      accessor: 'carModel',
      className: "policies-table-td"
    }, {
      Header: 'Last Annual Premium Gross',
      id: 'lastAnnualPremiumGross',
      accessor: d => Math.round(d.lastAnnualPremiumGross, 2),
      className: "policies-table-td"
    }, {
      Header: 'Max Coverage',
      accessor: 'maxCovered',
      className: "policies-table-td"
    }, {
      Header: 'Last Change',
      accessor: 'lastChange',
      className: "policies-table-td"
    }]



    if (this.state.policyClicked === true) {
      return <Redirect push to={'/policies/'.concat(this.state.policyId)} />
    } else return (
      <div className="policies-table">
        <ReactTable
          getTrProps={(state, rowInfo, column) => {
            return {
              onClick: (e, handleOriginal) => {
                this.setState({
                  policyClicked: true,
                  policyId: rowInfo.row.policyId
                })
                console.log(rowInfo.row.policyId)
                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
          data={this.props.carPolicies}
          columns={columns}
          defaultPageSize={100}
        />
      </div>
    )
  }
}

export default CarPoliciesList