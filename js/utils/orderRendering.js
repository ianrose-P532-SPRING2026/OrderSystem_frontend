export function fillList(list, orders, buttonFunc, triage) {
    //setting to default
    if(orders.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating

    //populating
    orders.forEach(order => {
        const li = document.createElement('li');    //create element
        if (triage == "DEADLINE"){
        buildOrderListEntryDEADLINE(li, order);             //fill it in
        } else{
            buildOrderListEntry(li, order);
        }
        buttonFunc(li, order);                      //add appropriate button
        list.appendChild(li);                       //add to list
    });
}


export function buildOrderListEntry(li, order){

    if(order.priority == "ROUTINE"){
        li.classList.add("routine-listing");
    }
    if(order.priority == "URGENT"){
        li.classList.add("urgent-listing");
    }
    if(order.priority == "STAT"){
        li.classList.add("stat-listing");
    }
    
    //these overwrite others
    if(order.status == "COMPLETED"){
        li.className = ""
        li.classList.add("complete-listing");
    }

    if(order.status == "CANCELLED"){
        li.className = ""
        li.classList.add("cancel-listing");
    }
    

    //time
    const openinstant = Temporal.Instant.from(order.timeOpened);
    const openedStr = openinstant.toLocaleString('en-US')

    let closed;
    if(order.timeClosed == null){
        closed = "N/A";
    } else{
        const closedinstant = Temporal.Instant.from(order.timeClosed);
        closed = closedinstant.toLocaleString('en-US')
    }

    const orderHeader = document.createElement('div');
    orderHeader.innerHTML=`<span>ID: ${order.ID}</span><span>Priority: ${order.priority}</span>`;
    orderHeader.classList.add("order-header");
    li.appendChild(orderHeader);

    const orderDetails = document.createElement('div');
    orderDetails.innerHTML=`<span><u>${order.issuerName}</u> requests <u>${order.type}</u> for <u>${order.patientName}</u></span><p>${order.description}</p>`;
    orderDetails.classList.add("order-details");
    li.appendChild(orderDetails);

    const orderTime = document.createElement('div');
    orderTime.innerHTML=`<span>Opened: ${openedStr}</span><br/><span>Closed: ${closed}</span>`;
    orderTime.classList.add("order-time");
    li.appendChild(orderTime);

    const orderStatus = document.createElement('div');
    orderStatus.innerHTML=`<span>Status: ${order.status}</span><span>Claimed by: ${order.claimantName}</span>`;
    orderStatus.classList.add("order-status");
    li.appendChild(orderStatus);
}


export function buildOrderListEntryDEADLINE(li, order){

    let timeLeft;
    if(order.priority == "ROUTINE"){
        li.classList.add("routine-listing");
        const startTime = Temporal.Instant.from(order.timeOpened);
        const deadline = startTime.add({ hours: 0, minutes: 5, seconds: 0 });
        const currentTime = Temporal.Now.instant();
        timeLeft = currentTime.until(deadline);
    }
    if(order.priority == "URGENT"){
        li.classList.add("urgent-listing");
        const startTime = Temporal.Instant.from(order.timeOpened);
        const deadline = startTime.add({ hours: 0, minutes: 2, seconds: 0 });
        const currentTime = Temporal.Now.instant();
        timeLeft = currentTime.until(deadline);
    }
    if(order.priority == "STAT"){
        li.classList.add("stat-listing");
        const startTime = Temporal.Instant.from(order.timeOpened);
        const deadline = startTime.add({ hours: 0, minutes: 0, seconds: 30 });
        const currentTime = Temporal.Now.instant();
        timeLeft = currentTime.until(deadline);
    }
    
    //these overwrite others
    if(order.status == "COMPLETED"){
        li.className = ""
        li.classList.add("complete-listing");
    }

    if(order.status == "CANCELLED"){
        li.className = ""
        li.classList.add("cancel-listing");
    }
    

    //time
    let closed;
    let overdue;
    let sign;
    if(order.timeClosed == null){
        const rounded = timeLeft.round({ largestUnit: 'minute' });
        console.log(closed);
        if (timeLeft.sign === -1){
            overdue = "<strong>!!OVERDUE!!</strong>";
            sign = "-";
        } else {
            overdue = "";
            sign = "";
        }
        closed = `${sign}${Math.abs(rounded.minutes)}:${String(Math.abs(rounded.seconds)).padStart(2, '0')}`;
    } else{
        closed = order.timeClosed;
    }

    const orderHeader = document.createElement('div');
    orderHeader.innerHTML=`<span>ID: ${order.ID}</span><span>Priority: ${order.priority}</span>`;
    orderHeader.classList.add("order-header");
    li.appendChild(orderHeader);

    const orderDetails = document.createElement('div');
    orderDetails.innerHTML=`<span><u>${order.issuerName}</u> requests <u>${order.type}</u> for <u>${order.patientName}</u></span><p>${order.description}</p>`;
    orderDetails.classList.add("order-details");
    li.appendChild(orderDetails);

    const orderTime = document.createElement('div');
    orderTime.innerHTML=`<span>Time Remaining: ${closed}</span><span><br/>${overdue}<br/></span><span>Opened: ${order.timeOpened}</span><br/>`;
    orderTime.classList.add("order-time");
    li.appendChild(orderTime);

    const orderStatus = document.createElement('div');
    orderStatus.innerHTML=`<span>Status: ${order.status}</span><span>Claimed by: ${order.claimantName}</span>`;
    orderStatus.classList.add("order-status");
    li.appendChild(orderStatus);
}