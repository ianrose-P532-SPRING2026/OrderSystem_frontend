import { host } from './host.js';

export async function submitOrder(actorId, patientName, desc, orderType, priority) {
    const NewOrderRequest = {patientName: patientName, issuerId: actorId, description: desc, type: orderType, priority: priority};
    console.log("You entered: " + JSON.stringify(NewOrderRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(NewOrderRequest)
    };

    const response = await fetch(host + "/orders/new", request);
    const result = await response.text();
    return result;
}

export async function cancelOrder(actorId, order) {
    if(actorId == -1){
        return "Please select a user.";
    }

    const CommandRequest = {orderId: order.ID, targetId: order.issuerID, actorId: actorId, action: "CANCEL"};
    console.log("You entered: " + JSON.stringify(CommandRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CommandRequest)
    };

    const response = await fetch(host + "/orders", request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();
    return result;
}

export async function claimOrder(actorId, order) {
    if(actorId == -1){
        return "Please select a user.";
    }

    const CommandRequest = {orderId: order.ID, targetId: actorId, actorId: actorId, action: "CLAIM"};
    console.log("You entered: " + JSON.stringify(CommandRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CommandRequest)
    };

    const response = await fetch(host + "/orders", request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();
    return result;
}

export async function completeOrder(actorId, order) {
    if(actorId == -1){
        return "Please select a user.";
    }

    const CommandRequest = {orderId: order.ID, targetId: actorId, actorId: actorId, action: "COMPLETE"};
    console.log("You entered: " + JSON.stringify(CommandRequest));

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CommandRequest)
    };

    const response = await fetch(host + "/orders", request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();
    return result;
}

