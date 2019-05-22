import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPolicies } from '../APIUtil'
import { addCarPolicies } from '../actions'
import CarPoliciesList from './CarPoliciesList'
import { Link } from 'react-router-dom'
import qs from 'qs';

class PoliciesList extends Component {

    state = {
        loading: true
    }

    componentDidMount() {
        const parsed = qs.parse(this.props.location.search.slice(1));
        console.log("queryString parsed: ", parsed)
        

        fetchPolicies().then((data) => {
            console.log(data);
            this.props.dispatch(addCarPolicies(data))
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
        if (this.state.loading) {
            return (
                <div>
                    <Link to='/' className="menu-link">Back to menu</Link>
                    <div className="loading" />
                </div>
            )
        }
        else {
            return (
                <div>
                    <Link to='/' className="menu-link">Back to menu</Link>
                    <CarPoliciesList carPolicies={this.props.carPolicies} />
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        carPolicies: state.carPolicies
    }
}

export default connect(mapStateToProps)(PoliciesList);
