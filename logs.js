const host = "http://localhost:8080"
//const host = "https://ordersystem-theextracrispy.onrender.com"

const logList = document.getElementById('logs');


async function listLogs(){
    try {
        const response = await fetch(host + "/logs");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const logs = await response.json();
        logs.reverse();
        logList.innerHTML = ""; //clear all before populating
        logs.forEach(log => {
            const li = document.createElement('li');

            const logText = document.createElement('pre');
            logText.textContent = `${log.type} Order #${log.orderId} by user #${log.actorId} at ${log.timestamp}`;

            const undoButton = document.createElement('button');
            undoButton.textContent = 'Undo';
            undoButton.addEventListener('click', () => {
                undoCommand(log);
            });

            const repeatButton = document.createElement('button');
            repeatButton.textContent = 'Repeat';
            repeatButton.addEventListener('click', () => {
                repeatCommand(log);
            });

            li.appendChild(logText);
            li.appendChild(undoButton);
            li.appendChild(repeatButton);
            logList.appendChild(li);
        });

    } catch (error) {
        console.error("Error showing logs:", error);
    }
}

async function undoCommand(log) {
    let LogEntry = log;
    
    console.log("You entered: " + JSON.stringify(LogEntry));

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(LogEntry)
    };

    let response = await fetch(host + "/logs/undo", request);
    if (response.ok){
        listLogs();
        alert("Command undone.")
    }
}

async function repeatCommand(log) {
    let LogEntry = log;
    
    console.log("You entered: " + JSON.stringify(LogEntry));

    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(LogEntry)
    };

    let response = await fetch(host + "/logs/repeat", request);
    if (response.ok){
        listLogs();
        alert("Command repeated.")
    }
}

listLogs();
setInterval(listLogs, 3000);