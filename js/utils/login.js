import { host } from './host.js';

export async function listValidUsers(link_tail) {
    const response = await fetch(`${host}/staff/${link_tail}`); 
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const validUsers = await response.json();
    return validUsers;
}

export function fillUserDropdown(loginDropdown, validUsers) {
    loginDropdown.innerHTML = `<option value="-1">SELECT USER</option>`;

    validUsers.forEach(user => {
        const option = document.createElement("option"); 
        option.value = user.id; 
        option.textContent = user.name;
        loginDropdown.appendChild(option);
    });
}