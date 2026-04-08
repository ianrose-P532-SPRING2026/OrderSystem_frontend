//-------------------------------------------------------LOGIN----------------------------------------------------------
import { listValidUsers, fillUserDropdown } from './utils/login.js';

const clinicalStaffLink = "clinical"
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
}

document.addEventListener('DOMContentLoaded', (event) => {
    setupUserDropdown();
    getClinicalDeptTriage();
    refresh();
    setInterval(refresh, 3000);
});

