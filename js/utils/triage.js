import { host } from './host.js';

export async function setDepartmentTriage(type, department) {
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(type)
    };

    const response = await fetch(`${host}/orders/${department}/triage`, request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();
    return result;
}

export async function getDepartmentTriage(department) {
    const response = await fetch(`${host}/orders/${department}/triage`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}