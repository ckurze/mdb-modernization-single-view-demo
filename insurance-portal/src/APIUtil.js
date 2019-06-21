const api = "http://localhost:4000"

const headers = {
    'Accept': 'application/json'
}

const headersForJSONPayload = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

export const fetchPolicies = (type) =>
    fetch(`${api}/policies?type=${type}`, { headers })
        .then(res => res.json())

export const fetchCustomers = () =>
    fetch(`${api}/customer`, { headers })
        .then(res => res.json())

/*
export const fetchCustomersPaginated = (page, pageSize) => {
    console.log(page)
    if (page === 0) {
        console.log('Page is 0, will return empty result.')
        return { data: [], pages: 0 }
    }

    return fetch(`${api}/customer?page=${page}&customers_per_page=${pageSize}`, { headers })
        .then(res => res.json())
}
*/

export const fetchCustomersAll = () => 
    fetch(`${api}/customer/all`, { headers })
        .then(res => res.json())

export const fetchCustomer = (customer_id) =>
    fetch(`${api}/customer/all?customer_id=${customer_id}`, { headers })
        .then(res => res.json())


export const createPolicy = (policy, type) => {
    // Server expects form data, converting JSON to form data
    const formData = Object.keys(policy).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(policy[key]);
    }).join('&');


    console.log("createPolicy payload ", formData)

    return fetch(`${api}/policies?type=${type}`, {
        method: 'POST',
        headers: headersForJSONPayload,
        body: formData
    }).then(res => res.json())
}