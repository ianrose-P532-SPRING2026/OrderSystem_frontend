const host = "http://localhost:8080"
//const host = "https://ordersystem-theextracrispy.onrender.com"

const loginDropdown = document.getElementById("login");
const orderList = document.getElementById("orderList");

let currentUser;

async function listValidUsers() {
    try {
        const response = await fetch(host + '/staff/fulfillment'); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let validUsers = await response.json();

        loginDropdown.innerHTML = "<option value=\"\">SELECT USER</option>"; //clear all before populating

        validUsers.forEach(user => {
            const option = document.createElement("option"); 
            option.value = user.id; 
            option.textContent = `${user.name}, ${user.role}`;
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


            const claimButton = document.createElement('button');
            claimButton.textContent = 'Claim';
            claimButton.addEventListener('click', () => {
                claimOrder(order);
            });

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', () => {
                completeOrder(order);
            });

            li.appendChild(orderText);
            li.appendChild(claimButton);
            li.appendChild(completeButton);
            orderList.appendChild(li);
        });

    } catch (error) {
        console.error("Error showing orders:", error);
    }
}

async function claimOrder(order) {
    let CommandRequest = {orderId: order.ID, actorId: currentUser, action: "CLAIM"};
    
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
        alert("Order claimed.");
        listAllOrders();
    }
}

async function completeOrder(order) {
    let CommandRequest = {orderId: order.ID, actorId: currentUser, action: "COMPLETE"};
    
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
        alert("Order completed.");
        listAllOrders();
    }
}

listAllOrders();
setInterval(listAllOrders, 3000);