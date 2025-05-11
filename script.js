/* Aditya Pandey - Canvas setup and event handling */
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const logDiv = document.getElementById("log");
let nodes = [], edges = [], selectedNode = null;

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
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
