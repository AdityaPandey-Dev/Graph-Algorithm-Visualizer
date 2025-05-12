/* Aditya Pandey - Canvas setup and event handling */
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const logDiv = document.getElementById("log");
let nodes = [], edges = [], selectedNode = null;

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect(); // Get the canvas's bounding box
    const scaleX = canvas.width / rect.width;   // Horizontal scaling factor
    const scaleY = canvas.height / rect.height; // Vertical scaling factor

    // Adjust the mouse position to account for scaling
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    let clickedNode = nodes.find(node => Math.hypot(node.x - x, node.y - y) < 20);
    if (clickedNode) {
        if (selectedNode && selectedNode !== clickedNode) {
            let weight = Math.floor(Math.random() * 10) + 1;
            edges.push({ from: selectedNode, to: clickedNode, weight });
            selectedNode = null;
        } else {
            selectedNode = clickedNode;
        }
    } else {
        // Create a new node at the adjusted position
        const newNode = {
            id: nodes.length + 1,
            x: x,
            y: y
        };

        nodes.push(newNode);
    }
    drawGraph();
});

/* Tanmay Sagar - Graph drawing logic and utility functions */
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges with enhanced styling
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.strokeStyle = "#555"; // Darker edge color for better visibility
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw edge weights with bold font
        ctx.fillStyle = "#000"; // Black color for text
        ctx.font = "bold 14px Arial";
        ctx.fillText(edge.weight, (edge.from.x + edge.to.x) / 2, (edge.from.y + edge.to.y) / 2);
    });

    // Draw nodes with enhanced styling
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#87CEEB"; // Light blue color for nodes
        ctx.fill();
        ctx.strokeStyle = "#000"; // Black border for nodes
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw node labels with bold font
        ctx.fillStyle = "#000"; // Black color for text
        ctx.font = "bold 16px Arial";
        ctx.fillText(node.id, node.x - 5, node.y + 5);
    });
}

/* Kartik Bisht - BFS and DFS implementations */
// Add debugging logs to track execution
console.log("Nodes:", nodes);
console.log("Edges:", edges);

function startBFS() {
    if (nodes.length === 0) {
        logMessage("No nodes available. Please create nodes to start BFS.");
        return;
    }
    console.log("Starting BFS...");
    showPopup("<strong>BFS (Breadth-First Search):</strong> BFS is an algorithm for traversing or searching tree or graph data structures. It starts at the root node and explores all neighbors at the present depth before moving on to nodes at the next depth level.");
    let queue = [nodes[0]];
    let visited = new Set();
    logDiv.innerHTML = "<strong>BFS Execution:</strong><br>";
    function step() {
        console.log("Queue:", queue);
        if (queue.length === 0) return;
        let node = queue.shift();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id}`);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        // Fix edge filtering by comparing node IDs
        edges.filter(e => e.from.id === node.id).forEach(edge => {
            if (!visited.has(edge.to)) queue.push(edge.to);
        });
        setTimeout(step, 500);
    }
    step();
}

function startDFS() {
    if (nodes.length === 0) {
        logMessage("No nodes available. Please create nodes to start DFS.");
        return;
    }
    console.log("Starting DFS...");
    showPopup("<strong>DFS (Depth-First Search):</strong> DFS is an algorithm for traversing or searching tree or graph data structures. It starts at the root node and explores as far as possible along each branch before backtracking.");
    let stack = [nodes[0]];
    let visited = new Set();
    logDiv.innerHTML = "<strong>DFS Execution:</strong><br>";
    function step() {
        console.log("Stack:", stack);
        if (stack.length === 0) return;
        let node = stack.pop();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id}`);
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        edges.filter(e => e.from.id === node.id).forEach(edge => {
            if (!visited.has(edge.to)) stack.push(edge.to);
        });
        setTimeout(step, 500);
    }
    step();
}
/* Gaurang Joshi - Dijkstra's algorithm implementation and popup logic */
function startDijkstra() {
    if (nodes.length === 0) {
        logMessage("No nodes available. Please create nodes to start Dijkstra's algorithm.");
        return;
    }
    console.log("Starting Dijkstra's Algorithm...");
    let distances = {};
    let visited = new Set();
    let queue = [{ node: nodes[0], cost: 0 }];
    nodes.forEach(node => distances[node.id] = Infinity);
    distances[nodes[0].id] = 0;
    logDiv.innerHTML = "<strong>Dijkstra Execution:</strong><br>";
    function step() {
        console.log("Queue:", queue);
        console.log("Visited:", visited);
        if (queue.length === 0) return;
        queue.sort((a, b) => a.cost - b.cost);
        let { node, cost } = queue.shift();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id} with cost ${cost}`);
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        edges.filter(e => e.from.id === node.id).forEach(edge => {
            let newCost = cost + edge.weight;
            if (newCost < distances[edge.to.id]) {
                distances[edge.to.id] = newCost;
                queue.push({ node: edge.to, cost: newCost });
                logMessage(`Updating distance of Node ${edge.to.id} to ${newCost}`);
            }
        });
        // Ensure canvas updates correctly
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGraph();
        setTimeout(step, 500);
    }
    step();
}

function showPopup(content) {
    const popup = document.getElementById("infoPopup");
    popup.innerHTML = content;
    popup.classList.remove("hidden");
    popup.classList.add("visible");
}

function hidePopup() {
    const popup = document.getElementById("infoPopup");
    popup.classList.remove("visible");
    popup.classList.add("hidden");
}

function resetGraph() {
    nodes = [];
    edges = [];
    selectedNode = null;
    logDiv.innerHTML = "";
    drawGraph();
    logMessage("Graph has been reset.");
}

function logMessage(message) {
    logDiv.innerHTML += message + "<br>";
}

