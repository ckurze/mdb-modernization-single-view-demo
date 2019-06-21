export const ADD_CAR_POLICIES = 'ADD_CAR_POLICIES'
export const ADD_HOME_POLICIES = 'ADD_HOME_POLICIES'
export const ADD_CUSTOMERS = 'ADD_CUSTOMERS'
export const ADD_CUSTOMER = 'ADD_CUSTOMER'

export function addCarPolicies(policies) {
    return {
        type: ADD_CAR_POLICIES,
        policies
    }
}

export function addHomePolicies(policies) {
    return {
        type: ADD_HOME_POLICIES,
        policies
    }
}

export function addCustomers(customers) {
    return {
        type: ADD_CUSTOMERS,
        customers
    }
}

export function addCustomer(customer) {
    return {
        type: ADD_CUSTOMER,
        customer
    }
}

