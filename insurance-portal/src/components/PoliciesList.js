import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPolicies } from '../APIUtil'
import { addCarPolicies, addHomePolicies } from '../actions'
import CarPoliciesList from './CarPoliciesList'
import { Link } from 'react-router-dom'
import qs from 'qs';

class PoliciesList extends Component {

    state = {
        policyType: 'motor',
        loading: true
    }

    componentDidMount() {
        const parsed = qs.parse(this.props.location.search.slice(1));
        const policyType = ("type" in parsed) ? parsed.type : 'motor'
        console.log("queryString parsed: ", parsed, ", calculated type: ", policyType)
        this.setState({ policyType: policyType })

        fetchPolicies(policyType).then((data) => {
            console.log(data);
            if (policyType === "motor") this.props.dispatch(addCarPolicies(data))
            if (policyType === "home") this.props.dispatch(addHomePolicies(data))
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps)
        if (nextProps.carPolicies) {
          this.setState(
            {
                ...this.state,
                loading: false
            }
          )
        }
      }

    render() {


        if(this.state.loading){
            return (
                <div>
                    <Link to='/navigation' className="menu-link">Back to menu</Link>
                    <div className="loading"/>
                </div>
            )
        }
        if (this.state.policyType === "motor")
            return (
                <div>
                    <Link to='/navigation' className="menu-link">Back to menu</Link>
                    <CarPoliciesList carPolicies={this.props.carPolicies} />
                </div>
        )


    }
}

const mapStateToProps = state => {
    return {
        carPolicies: state.carPolicies
    }
}

export default connect(mapStateToProps)(PoliciesList);
