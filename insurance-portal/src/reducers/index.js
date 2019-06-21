import { ADD_CAR_POLICIES, ADD_CUSTOMERS, ADD_CUSTOMER } from '../actions'

const initialState = {
    carPolicies: [],
    customers: []
}

function replaceOrAdd(customers, customer) {
    let found = false

    let ret = customers.map(c => {
        if (c.customer_id === customer.customer_id) {
            found = true
            return customer
        } else {
            return c
        }
    })

    if (found === false)
        ret.push(customer)

    return ret;
}

function reducer(state = initialState, action) {
    console.log("reducer executed", action)
    switch (action.type) {
        case ADD_CAR_POLICIES:
            return {
                ...state,
                "carPolicies": action.policies
            }
        case ADD_CUSTOMERS:
            return {
                ...state,
                "customers": action.customers
            }
        case ADD_CUSTOMER:
            return {
                ...state,
                "customers": replaceOrAdd(state.customers, action.customer)
            }
        default:
            return state
    }
}

export default reducer;