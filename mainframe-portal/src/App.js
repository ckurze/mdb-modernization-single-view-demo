import React, { Component } from 'react';
import './App.css';
import PoliciesList from './components/PoliciesList';
import Navigation from './components/Navigation';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import PolicyDetail from './components/PolicyDetail';
import { connect } from 'react-redux'
import CustomerList from './components/CustomerList';
import CreateCarInsurancePolicy from './components/CreateCarInsurancePolicy';
import CreateCarInsuranceClaim from './components/CreateCarInsuranceClaim';
import ClaimDetail from './components/ClaimDetail'

class App extends Component {

  render() {
    return (
      <div className="app">
        <div className="applicationHeader">
          <h1>Bullwork Car Insurance</h1>
        </div>
        <Router>
          <div>
            <Route exact path="/" component={Navigation} />
            <Route exact path="/customers" component={CustomerList} />
            <Route exact path="/create-car-policy" component={CreateCarInsurancePolicy} />
            <Route path="/create-car-claim/:id" component={CreateCarInsuranceClaim} />
            <Route exact path="/policies" component={PoliciesList} />
            <Route exact path="/policies/:id" component={PolicyDetail} />
            <Route exact path="/claims/:id" component={ClaimDetail} />
          </div>
        </Router>
      </div>
    );
  }
}

export default connect()(App);
