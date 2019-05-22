import { ADD_CAR_POLICIES, ADD_CUSTOMERS, ADD_CAR_POLICY, ADD_CAR_CLAIM } from '../actions'

const initialState = {
    carPolicies: [],
    customers: [],
    carClaims: []
}

function reducer(state = initialState, action) {
    console.log("reducer executed", action)
    switch (action.type) {
        case ADD_CAR_POLICIES:
            return {
                ...state,
                "carPolicies": action.policies
            }
        case ADD_CAR_POLICY:
            return {
                ...state,
                "carPolicies": [
                    ...state.carPolicies,
                    action.policy
                ]
            }
        case ADD_CAR_CLAIM:
            return {
                ...state,
                "carClaims": [
                    ...state.carClaims,
                    action.claim
                ]
            }
        case ADD_CUSTOMERS:
            return {
                ...state,
                "customers": action.customers
            }

        default:
            return state
    }
}

export default reducer;