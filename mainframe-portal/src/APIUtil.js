import sleep from 'sleep-promise'

const api = "http://localhost:8080/car"

const headers = {
    'Accept': 'application/json'
}

export const fetchPolicies = () =>
    sleep(2000)
    (fetch(`${api}/policy/all`, { headers })
        .then(res => res.json()))

export const fetchPolicy = (policy_id) =>
    fetch(`${api}/policy/${policy_id}`, { headers })
        .then(res => res.json())

export const fetchCustomers = () =>
    sleep(2000)
    (fetch(`${api}/customer/all`, { headers })
        .then(res => res.json()))

export const createPolicy = (policy) => {
    console.log("createPolicy payload ", policy)

    return fetch(`${api}/policy/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
    }).then(res => res.json())
}

export const fetchClaim = (claim_id) => {
    sleep(2000)
    return(fetch(`${api}/claim/${claim_id}`, { headers })
        .then(res => res.json()))
}

export const createClaim = (claim) => {
    return fetch(`${api}/claim/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim)
    }).then(res => res.json())
}