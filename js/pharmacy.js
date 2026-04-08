//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const pharmacyStaffLink = "pharmacy"
const loginDropdown = document.getElementById("login");

async function setupUserDropdown(){
    const validUsers = await listValidUsers(pharmacyStaffLink);
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

const pharmacyTriageLink = "pharmacy";

const triageSelector = document.getElementById('triageDropdown');
const triageButton = document.getElementById('triageButton');

triageButton.addEventListener("click", function(event) {
    const type = triageSelector.value;
    setPharmacyDeptTriage(type);
});

async function setPharmacyDeptTriage(type) {
    const result = await setDepartmentTriage(type, pharmacyTriageLink);
    alert(result);
    refresh();
}

async function getPharmacyDeptTriage() {
    const result = await getDepartmentTriage(pharmacyTriageLink);
    triageSelector.value = result;
}
//----------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------READING ORDERS-----------------------------------------------------
import { getOrders, requestPersonalOrders } from './utils/orderRequesting.js';
import { fillList } from './utils/orderRendering.js';

const pharmacistOrdersLink = "pharmacy";
const pendingList = document.getElementById("pendingOrders");

async function populatePharmacistOrders() {
    const orders = await getOrders(pharmacistOrdersLink);
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
    populatePharmacistOrders();
    populateAssignedOrders();
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getPharmacyDeptTriage();
    refresh();
    setInterval(refresh, 3000);
});
