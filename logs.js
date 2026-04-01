const host = "http://localhost:8080"

const logList = document.getElementById('logs');


//int entryId, CommandType type, int orderId, int actorId, Instant timestamp

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

            li.appendChild(logText);
            logList.appendChild(li);
        });

    } catch (error) {
        console.error("Error showing orders:", error);
    }
}

listLogs();