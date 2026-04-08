//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const radiologyStaffLink = "radiology"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(radiologyStaffLink);
    fillUserDropdown(loginDropdown, validUsers);
}

loginDropdown.addEventListener("change", async function(event) {
    currentUser = event.target.value;
    if (currentUser != -1){
        await getNotification(currentUser);
        await counter(currentUser);
    }
    refresh();
});

let currentUser = -1;
//----------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------TRIAGE---------------------------------------------------------
import { setDepartmentTriage, getDepartmentTriage } from './utils/triage.js';

const radiologyTriageLink = "radiology";

const triageSelector = document.getElementById('triageDropdown');
const triageButton = document.getElementById('triageButton');

triageButton.addEventListener("click", function(event) {
    const type = triageSelector.value;
    setRadiologyDeptTriage(type);
});

async function setRadiologyDeptTriage(type) {
    const result = await setDepartmentTriage(type, radiologyTriageLink);
    alert(result);
    refresh();
}

async function getRadiologyDeptTriage() {
    const result = await getDepartmentTriage(radiologyTriageLink);
    triageSelector.value = result;
}
//----------------------------------------------------------------------------------------------------------------------



//---------------------------------------------------READING ORDERS-----------------------------------------------------
import { getOrders, requestPersonalOrders } from './utils/orderRequesting.js';
import { fillList } from './utils/orderRendering.js';

const radiologyOrderLink = "radiology";
const pendingList = document.getElementById("pendingOrders");

async function populateImagingOrders() {
    const orders = await getOrders(radiologyOrderLink);
    fillList(pendingList, orders, addFulfillmentClaimButton);
}


const assignedList = document.getElementById("assignedOrders");
const assignedLink = "assigned";

async function populateAssignedOrders(){
    if(currentUser == -1){ return; }
    const orders = await requestPersonalOrders(currentUser, assignedLink);
    fillList(assignedList, orders, addFulfillmentCompleteButton);
}

function addFulfillmentClaimButton(listItem, order){
    if(order.status == "PENDING"){
        const claimButton = document.createElement('button');
        claimButton.textContent = 'Claim';
        claimButton.addEventListener('click', () => {
            claimButtonFunc(order);
        });
        listItem.appendChild(claimButton);
    }
}

function addFulfillmentCompleteButton(listItem, order){
    if(order.status == "IN_PROGRESS"){
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            completeButtonFunc(order);
        });
        listItem.appendChild(completeButton);
    }
}
//----------------------------------------------------------------------------------------------------------------------

import { host } from './utils/host.js';

document.getElementById('CONSOLE').addEventListener('change', clickedCONSOLE);
document.getElementById('EMAIL').addEventListener('change', clickedEMAIL);
document.getElementById('COUNTER').addEventListener('change', clickedCOUNTER);

async function clickedCONSOLE() {
    const consoleCheckbox = document.getElementById("CONSOLE");
    const consoleEnabled = consoleCheckbox.checked;

    if(consoleEnabled == true){
        await addNotification("CONSOLE", currentUser);
    } else {
        await removeNotification("CONSOLE", currentUser);
    }
}
async function clickedEMAIL() {
    const consoleCheckbox = document.getElementById("EMAIL");
    const consoleEnabled = consoleCheckbox.checked;

    if(consoleEnabled == true){
        await addNotification("EMAIL", currentUser);
    } else {
        await removeNotification("EMAIL", currentUser);
    }
}
async function clickedCOUNTER() {
    const consoleCheckbox = document.getElementById("COUNTER");
    const consoleEnabled = consoleCheckbox.checked;
    const counter = document.getElementById("COUNT");

    if(consoleEnabled == true){
        await addNotification("COUNTER", currentUser);
        counter.style.visibility = "visible";
    } else {
        await removeNotification("COUNTER", currentUser);
        counter.style.visibility = "hidden";
    }
}

async function addNotification(type, uid) {
    const notifRequest = {id: uid, type: type};

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notifRequest)
    };
    if(uid != -1){
        const response = await fetch(host + "/staff/notif/add", request);
    }
}

async function removeNotification(type, uid) {
    const notifRequest = {id: uid, type: type};

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notifRequest)
    };
    if(uid != -1){
        const response = await fetch(host + "/staff/notif/remove", request);
    }
}

async function getNotification(uid) {
    const notifRequest = uid;

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notifRequest)
    };
    const response = await fetch(host + "/staff/notif/get", request);
    const notifs = await response.json();
    
    const enabledSet = Object.entries(notifs);

    uncheckAll(); //this is super bad and sucks but whatever if it works i guess
    enabledSet.forEach(checkBoxes);
}

async function counter(uid){
    const counter = document.getElementById("COUNT");

    const notifRequest = uid;

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notifRequest)
    };
    const response = await fetch(host + "/staff/notif/counter", request);
    let count;
    try{
        count = await response.json();
    } catch {
        count = 0;
    }
    
    counter.textContent = count;
}

function uncheckAll() {
    const consoleCheckbox = document.getElementById("CONSOLE");
    const emailCheckbox = document.getElementById("EMAIL");
    const counterCheckbox = document.getElementById("COUNTER");
    consoleCheckbox.checked = false;
    emailCheckbox.checked = false;
    counterCheckbox.checked = false;

    const counter = document.getElementById("COUNT");
    counter.style.visibility = "hidden";
}

function checkBoxes([key, value]){
    const box = document.getElementById(value);
    if (value == "COUNTER"){
        const counter = document.getElementById("COUNT");
        counter.style.visibility = "visible";
    }
    box.checked = true;
}




//-------------------------------------------------------ORDERS---------------------------------------------------------
import { claimOrder, completeOrder } from './utils/commands.js';


async function claimButtonFunc(order) {
    const result = await claimOrder(currentUser, order);

    if (result != "OK"){
        alert(result);
    } else {
        alert("Order claimed.");
        refresh();
    }
}

async function completeButtonFunc(order) {
    const result = await completeOrder(currentUser, order);

    if (result != "OK"){
        alert(result);
    } else {
        alert("Order completed.");
        refresh();
    }
}
//----------------------------------------------------------------------------------------------------------------------



function refresh(){
    populateImagingOrders();
    populateAssignedOrders();
    counter(currentUser);
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getRadiologyDeptTriage();
    refresh();
    setInterval(refresh, 3000);
});
