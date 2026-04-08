import { host } from './host.js';

export async function getLogs() {
    const response = await fetch(host + "/logs");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const logs = await response.json();
    logs.reverse();
    return logs;
}

export function listLogs(list, logs, buttonFunc){
    if(logs.length == 0){
        list.innerHTML = `<li style="text-align: center; list-style-type: none;">(none)</li>`;
        return;
    }
    list.innerHTML = ""; //clear all before populating
    logs.forEach(log => {
        const li = document.createElement('li');
        
        buildLogEntry(li, log);

        buttonFunc(li, log);

        list.appendChild(li);
    });
}


function buildLogEntry(li, log) {
    const instant = Temporal.Instant.from(log.timestamp);
    const timeStr = instant.toLocaleString('en-US')
    if(log.undone){
        const logText = document.createElement('pre');
        logText.innerHTML = `
<del>Type: ${log.type} at ${timeStr}
Actor: ID#${log.actorId}: ${log.actorName}
Target: ID#${log.targetStaffId}: ${log.targetName}

Order: ID#${log.orderId}
Summary: ${log.orderSummary}
Issued by: ${log.issuerName}

Additional Details: 
${log.statDeet}
<del/>`;

        li.appendChild(logText);
    } 

    else {
        const logText = document.createElement('pre');
        logText.innerHTML = `
Type: ${log.type} at ${timeStr}
Actor: ID#${log.actorId}: ${log.actorName}
Target: ID#${log.targetStaffId}: ${log.targetName}

Order: ID#${log.orderId}
Summary: ${log.orderSummary}
Issued by: ${log.issuerName}

Additional Details: 
${log.statDeet}`;

        li.appendChild(logText);
    }
}