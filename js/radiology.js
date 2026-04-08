//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const radiologyStaffLink = "radiology"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(radiologyStaffLink);
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
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getRadiologyDeptTriage();
    refresh();
    setInterval(refresh, 3000);
});
