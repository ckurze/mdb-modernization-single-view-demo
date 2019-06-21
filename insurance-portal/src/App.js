import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import CustomerDetail from './components/CustomerDetail';
import { connect } from 'react-redux'
import CustomerList from './components/CustomerList';
import CustomerLookup from './components/CustomerLookup';
import { fetchCustomers } from './APIUtil'
import { fetchCustomersAll } from './APIUtil'
import { addCustomers } from './actions'

class App extends Component {

  componentDidMount() {
    console.log("Component did mount App.js");
    fetchCustomersAll().then((data) => {
      console.log(data);
      this.props.dispatch(addCustomers(data))
    });
  }


  render() {
    return (
      <div className="app">
        <Router>
          <div className="container">
            <div>
              <nav>
                <ul className="nav-ul">
                  <li>
                    <Link to="/customers">Customers</Link>
                  </li>
                  <li>
                    <Link to="/customer-lookup">Look up customer</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div>
              <h1>Insurance 360°</h1>
            </div>
            <div>
              <Route exact path="/" component={CustomerList} />
              <Route exact path="/customers" component={CustomerList} />
              <Route exact path="/customers/:id" component={CustomerDetail} />
              <Route exact path="/customer-lookup" component={CustomerLookup} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default connect()(App);
