import { host } from './utils/host.js';

const newUserForm = document.getElementById('newUser');
const userList = document.getElementById('userList');

//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const clinicalStaffLink = "admin"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(clinicalStaffLink);
    fillUserDropdown(loginDropdown, validUsers);
}
document.addEventListener('DOMContentLoaded', (event) => {
  setupUserDropdown();
});
loginDropdown.addEventListener("change", function(event) {
    currentUser = event.target.value;
    refresh();
});

let currentUser = -1;
//----------------------------------------------------------------------------------------------------------------------



async function listAllUsers(){
    try {
        const response = await fetch(host + "/staff/all");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const users = await response.json();

        userList.innerHTML = ""; //clear all before populating
        users.forEach(user => {
            const li = document.createElement('li');
            
            const userSpan = document.createElement('span');
            userSpan.textContent = `
            User ${user.id}: ${user.name}, ${user.role}
            `;


            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete User';

            deleteButton.addEventListener('click', () => {
                deleteUser(user);
            });

            li.appendChild(userSpan);
            li.appendChild(deleteButton);
            userList.appendChild(li);
        });

    } catch (error) {
        console.error("Error when showing users:", error);
    }
}

async function createNewUser(name, role) {
    if(currentUser == -1){
        alert("Please select a user.");
        return;
    }

    let NewStaffRequest = {name: name, role: role, targetId: -1, requestingId: currentUser};

    console.log("You entered: " + JSON.stringify(NewStaffRequest));

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(NewStaffRequest)
    };

    let response = await fetch(host + "/staff/new", request);
    let result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        alert("User added.");
        listAllUsers();
    }
}

async function deleteUser(userListed) {
    if(currentUser == -1){
        alert("Please select a user.");
        return;
    }
    
    let NewStaffRequest = {name: userListed.name, role: userListed.role, targetId: userListed.id, requestingId: currentUser};
    
    console.log("You entered: " + JSON.stringify(NewStaffRequest));

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(NewStaffRequest)
    };

    let response = await fetch(host + "/staff/delete", request);
    let result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        alert("User deleted.");
        listAllUsers();
    }
}







newUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;

    createNewUser(name, role);
});


listAllUsers();