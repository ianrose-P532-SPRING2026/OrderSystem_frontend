//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const clinicalStaffLink = "clinical"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(clinicalStaffLink);
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

let currentStrat = "PRIORITY";

const clinicalTriageLink = "clinical";

const triageSelector = document.getElementById('triageDropdown');
const triageButton = document.getElementById('triageButton');

triageButton.addEventListener("click", function(event) {
    const type = triageSelector.value;
    setClinicalDeptTriage(type);
    currentStrat = type;
});

async function setClinicalDeptTriage(type) {
    const result = await setDepartmentTriage(type, clinicalTriageLink);
    alert(result);
    refresh();
}

async function getClinicalDeptTriage() {
    const result = await getDepartmentTriage(clinicalTriageLink);
    triageSelector.value = result;
    currentStrat = result;
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


//---------------------------------------------------READING ORDERS-----------------------------------------------------
import { getOrders, requestPersonalOrders } from './utils/orderRequesting.js';
import { fillList } from './utils/orderRendering.js';

const clinicianOpenLink = "clinical/open"
const openList = document.getElementById("openOrders");
async function populateClinicianOpenOrders() {
    const orders = await getOrders(clinicianOpenLink);
    fillList(openList, orders, addClinicalCancelButton, currentStrat);
}

const clinicianClosedLink = "clinical/closed"
const closedList = document.getElementById("closedOrders");
async function populateClinicianClosedOrders(){
    if(currentUser == -1){ return; }
    const orders = await requestPersonalOrders(currentUser, clinicianClosedLink);
    fillList(closedList, orders, addClinicalCancelButton, currentStrat);
}

function addClinicalCancelButton(listItem, order){
    if(order.status == "PENDING"){
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            cancelButtonFunc(order);
        });
        listItem.appendChild(cancelButton);
    }
}
//----------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------ORDERS---------------------------------------------------------
import { submitOrder, cancelOrder } from './utils/commands.js';

const newOrderForm = document.getElementById('newOrder');
newOrderForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const patientName = document.getElementById('patientName').value;
    const desc = document.getElementById('desc').value;
    const orderType = document.getElementById('orderType').value;
    const priority = document.getElementById('priority').value;

    submitNewOrder(patientName, desc, orderType, priority);
});

async function submitNewOrder(patientName, desc, orderType, priority) {
    const result = await submitOrder(currentUser, patientName, desc, orderType, priority)
    if (result != "OK"){
        alert(result);
    } else {
        alert("Order submitted.");
        refresh();
    }
}

async function cancelButtonFunc(order) {
    const result = await cancelOrder(currentUser, order);

    if (result != "OK"){
        alert(result);
    } else {
        alert("Order canceled.");
        refresh();
    }
}
//----------------------------------------------------------------------------------------------------------------------



function refresh(){
    populateClinicianOpenOrders();
    populateClinicianClosedOrders();
    counter(currentUser);
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getClinicalDeptTriage();
    refresh();
    setInterval(refresh, 3000);
});

