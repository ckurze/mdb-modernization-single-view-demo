import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import qs from 'qs';
import { fetchClaim } from '../APIUtil'
import { fetchCarClaim } from '../actions'

class ClaimDetail extends Component {

    state = {
        success: false
    }

    componentDidMount() {
        console.log("componentDidMount ClaimDetail")
        const parsed = qs.parse(this.props.location.search.slice(1));
        const success = ("success" in parsed) ? true : false
        if (success) console.log("redirect from create claim screen")
        this.setState({ success: success })

        if (this.props.claim === undefined) {
            console.log("claim does not exist in store, fetching from server")
            fetchClaim(this.props.match.params.id).then(value =>
                this.props.dispatch(fetchCarClaim(value)))
        }

    }

    renderCarClaim = carClaim => (
        <div className="tile contact claim-tile">
            <div className="row">Policy ID: {carClaim.policyId}</div>
            <div className="row">Claim Date: {carClaim.claimDate}</div>
            <div className="row">Claim Amount: {carClaim.claimAmount}</div>
            <div className="row">Settled Date: {carClaim.settledDate}</div>
            <div className="row">Settled Amount: {carClaim.settledAmount}</div>
            <div className="row">Claim Reason: {carClaim.claimReason}</div>
        </div>
    )

    render() {
        if (this.props.claim === undefined)
            return (<div><Link to='/' className="menu-link">Back to menu</Link></div>)

        return (
            <div>
                <Link to='/' className="menu-link">Back to menu</Link>
                <h2 className="applicationHeader"> {this.state.success && <div>Claim created</div>}  </h2>
                <div className="policyForm">
                    {this.renderCarClaim(this.props.claim)}
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    console.log("mapStateToProps PolicyDetail")
    return {
        claim: state.carClaims.find(e => e.claimId === ownProps.match.params.id)
    }
}

export default connect(mapStateToProps)(ClaimDetail)