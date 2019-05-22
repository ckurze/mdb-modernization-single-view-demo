export const ADD_CAR_POLICIES = 'ADD_CAR_POLICIES'
export const ADD_CUSTOMERS = 'ADD_CUSTOMERS'
export const ADD_CAR_POLICY = 'ADD_CAR_POLICY'
export const ADD_CAR_CLAIM = 'ADD_CAR_CLAIM'

export function addCarPolicies(policies) {
    return {
        type: ADD_CAR_POLICIES,
        policies
    }
}

export function fetchCarPolicy(policies) {
    return {
        type: ADD_CAR_POLICIES,
        policies
    }
}

export function addCarPolicy(policy) {
    return {
        type: ADD_CAR_POLICY,
        policy
    }
}

export function fetchCarClaim(claim) {
    return {
        type: ADD_CAR_CLAIM,
        claim
    }
}

export function addCarClaim(claim) {
    return {
        type: ADD_CAR_CLAIM,
        claim
    }
}

export function addCustomers(customers) {
    return {
        type: ADD_CUSTOMERS,
        customers
    }
}
