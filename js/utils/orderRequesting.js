import { host } from './host.js';

export async function getOrders(link_tail) {
    //polling backend
    const response = await fetch(`${host}/orders/${link_tail}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const orders = await response.json();
    return orders;
}

export async function requestPersonalOrders(userId, link_tail) {
    if(userId == -1){ return; }

    const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userId)
    };

    const response = await fetch(`${host}/orders/${link_tail}`, request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    
    const orders = await response.json();
    return orders;
}
