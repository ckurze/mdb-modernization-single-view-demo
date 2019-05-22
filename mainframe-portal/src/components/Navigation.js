import React, { Component } from 'react'
import {
    Link
} from 'react-router-dom'

export default class Navigation extends Component {

    render() {
        return (
            <div className="containerBorder">
                <nav>
                    <Link to="/customers">Customer Overview</Link>
                    <Link to="/policies?type=motor">Car Insurance Policies Overview</Link>
                    <Link to="/create-car-policy">Create Car Insurance Policy</Link>
                </nav>
            </div>
        )
    }
}