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
