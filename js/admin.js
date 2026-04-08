import { host } from './utils/host.js';


//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';
import { getLogs, listLogs } from './utils/logs.js';


const clinicalStaffLink = "admin"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(clinicalStaffLink);
    fillUserDropdown(loginDropdown, validUsers);
}

loginDropdown.addEventListener("change", function(event) {
    currentUser = event.target.value;
    refresh();
});

let currentUser = -1;
//----------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------TRIAGE---------------------------------------------------------
import { setDepartmentTriage, getDepartmentTriage } from './utils/triage.js';

const adminTriageLink = "admin";

const triageSelector = document.getElementById('triageDropdown');
const triageButton = document.getElementById('triageButton');

triageButton.addEventListener("click", function(event) {
    const type = triageSelector.value;
    setAdminDeptTriage(type);
});

async function setAdminDeptTriage(type) {
    const result = await setDepartmentTriage(type, adminTriageLink);
    alert(result);
    refresh();
}

async function getAdminDeptTriage() {
    const result = await getDepartmentTriage(adminTriageLink);
    triageSelector.value = result;
}
//----------------------------------------------------------------------------------------------------------------------



//---------------------------------------------------READING ORDERS-----------------------------------------------------
import { getOrders, requestPersonalOrders } from './utils/orderRequesting.js';
import { fillList } from './utils/orderRendering.js';

const adminOrderLink = "admin"
const orderList = document.getElementById("allOrders");

async function populateAdminOrders() {
    const orders = await getOrders(adminOrderLink);
    fillList(orderList, orders, addAdminCancelButton);
}

function addAdminCancelButton(listItem, order){
    if(order.status == "PENDING" || order.status == "IN_PROGRESS"){
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
import { cancelOrder } from './utils/commands.js';

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



//--------------------------------------------------------LOGS----------------------------------------------------------
const logsList = document.getElementById("logsList");

async function populateAdminLogs(){
    const logs = await getLogs();
    listLogs(logsList, logs, adminUndoRedoButton);
}

function adminUndoRedoButton(li, log){
    if(log.undone){
        const repeatButton = document.createElement('button');
        repeatButton.textContent = 'Redo';
        repeatButton.addEventListener('click', () => {
            redoCommand(log);
        });
        li.appendChild(repeatButton);
    } 

    else {
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Undo';
        undoButton.addEventListener('click', () => {
            undoCommand(log);
        });
        li.appendChild(undoButton);
    }
}

async function undoCommand(log) {
    const LogEntry = log;
    
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(LogEntry)
    };

    const response = await fetch(host + "/logs/undo", request);
    const result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        refresh();
        alert("Command undone.");   
    }
}

async function redoCommand(log) {
    const LogEntry = log;
    
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(LogEntry)
    };

    const response = await fetch(host + "/logs/redo", request);
    const result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        refresh();
        alert("Command restored.");   
    }
}
//----------------------------------------------------------------------------------------------------------------------

function refresh(){
    populateAdminOrders();
    populateAdminLogs();
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getAdminDeptTriage();
    populateAdminLogs();
    refresh();
    setInterval(refresh, 3000);
});
