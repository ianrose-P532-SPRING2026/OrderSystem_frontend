//const host = "http://localhost:8080"
const host = "https://ordersystem-theextracrispy.onrender.com"

const loginDropdown = document.getElementById("login");
const orderList = document.getElementById("orderList");

let currentUser = 0;

async function listValidUsers() {
    try {
        const response = await fetch(host + '/staff/admins'); 

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
        });
    } catch (error) {
        console.error("Error fetching or populating dropdown:", error);
    }
}
login.addEventListener("change", function(event) {
    currentUser = event.target.value;
});
document.addEventListener('DOMContentLoaded', (event) => {
  listValidUsers();
});

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

async function listAllOrders(){
    try {
        const response = await fetch(host + "/orders/all");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const orders = await response.json();

        orderList.innerHTML = ""; //clear all before populating
        orders.forEach(order => {
            const li = document.createElement('li');
            
            let closed;
            if(order.timeClosed == null){
                closed = "N/A";
            } else{
                closed = order.timeClosed;
            }

            const orderText = document.createElement('pre');
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

listAllOrders();
setInterval(listAllOrders, 3000);