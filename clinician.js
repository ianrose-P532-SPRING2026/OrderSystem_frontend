//const host = "http://localhost:8080"
const host = "https://ordersystem-theextracrispy.onrender.com"

const loginDropdown = document.getElementById("login");
const orderList = document.getElementById("orderList");
const newOrderForm = document.getElementById('newOrder');

let currentUser;

async function listValidUsers() {
    try {
        const response = await fetch(host + '/staff/clinicians'); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let validUsers = await response.json();

        loginDropdown.innerHTML = "<option value=\"\">SELECT USER</option>"; //clear all before populating

        validUsers.forEach(user => {
            const option = document.createElement("option"); 
            option.value = user.id; 
            option.textContent = user.name;
            loginDropdown.appendChild(option);
            currentUser = user.id;
        });
    } catch (error) {
        console.error("Error fetching or populating dropdown:", error);
    }
}
loginDropdown.addEventListener("change", function(event) {
    currentUser = event.target.value;
});
document.addEventListener('DOMContentLoaded', (event) => {
  listValidUsers();
});


async function listAllOrders(){
    try {
        const response = await fetch(host + "/orders/pending");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const orders = await response.json();

        orderList.innerHTML = ""; //clear all before populating
        orders.forEach(order => {
            const li = document.createElement('li');
            
            const orderText = document.createElement('pre');
            
            let closed;
            if(order.timeClosed == null){
                closed = "N/A";
            } else{
                closed = order.timeClosed;
            }

            orderText.textContent = `${order.ID}: Priority: ${order.priority}
${order.issuerName} requests ${order.type} for ${order.patientName}
Desc: ${order.description}
Status: ${order.status}, Claimed by: ${order.claimantName} 
Time Opened: ${order.timeOpened}
Time Closed: ${closed}`;


            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', () => {
                cancelOrder(order);
            });

            li.appendChild(orderText);
            li.appendChild(cancelButton);
            orderList.appendChild(li);
        });

    } catch (error) {
        console.error("Error showing orders:", error);
    }
}


async function submitNewOrder(patientName, desc, orderType, priority) {
    let NewOrderRequest = {patientName: patientName, issuerId: currentUser, description: desc, type: orderType, priority: priority};

    console.log("You entered: " + JSON.stringify(NewOrderRequest));
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(NewOrderRequest)
    };

    let response = await fetch(host + "/orders/new", request);
    let result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        alert("Order submitted.");
        listAllOrders();
    }
}

async function cancelOrder(order) {
    let CommandRequest = {orderId: order.ID, actorId: currentUser, action: "CANCEL"};
    
    console.log("You entered: " + JSON.stringify(CommandRequest));

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CommandRequest)
    };

    let response = await fetch(host + "/orders", request);
    let result = await response.text();
    if (result != "OK"){
        alert(result);
    } else {
        alert("Order canceled.");
        listAllOrders();
    }
}

newOrderForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const patientName = document.getElementById('patientName').value;
    const desc = document.getElementById('desc').value;
    const orderType = document.getElementById('orderType').value;
    const priority = document.getElementById('priority').value;

    submitNewOrder(patientName, desc, orderType, priority);
});

listAllOrders();
setInterval(listAllOrders, 3000);