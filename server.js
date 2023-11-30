const WebSocket = require("ws");
const http = require("http");

// Your user key
const USER_KEY = process.env.NEXT_PUBLIC_WEBSOCKET_USER_KEY || "your-user-key";

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket proxy server is running");
});

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection to the data provider with user key
const dataProviderWebSocket = new WebSocket(
  "wss://marketdata.tradermade.com/feedadv",
  {
    headers: {
      // Include the user key in the WebSocket request headers
      Authorization: `Bearer ${USER_KEY}`,
    },
  }
);

// Keep track of connected clients
let connectedClients = 0;

// Function to broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Listen for WebSocket connections from clients
wss.on("connection", (clientWebSocket) => {
  console.log("Client connected");
  connectedClients++; // Increment the count
  console.log(`Connected clients: ${connectedClients}`);

  // Forward messages from the client to the data provider
  clientWebSocket.on("message", (message) => {
    console.log("Received from client:", message);
    dataProviderWebSocket.send(message);
  });

  // Forward messages from the data provider to the client
  dataProviderWebSocket.on("message", (message) => {
    // console.log("Received from data provider:", message);

    const jsonData = message.toString("utf-8");
    broadcast(jsonData); // Broadcast to all connected clients
  });

  // Handle WebSocket disconnection
  clientWebSocket.on("close", () => {
    console.log("Client disconnected");
    connectedClients--; // Decrement the count
    console.log(`Connected clients: ${connectedClients}`); // Log the updated number of connected clients
  });
});

// Start the HTTP server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket proxy server is listening on port ${PORT}`);
});

// const WebSocket = require("ws");
// const http = require("http");

// // Your user key
// const USER_KEY = process.env.NEXT_PUBLIC_WEBSOCKET_USER_KEY || "your-user-key";

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("WebSocket proxy server is running");
// });

// // Create a WebSocket server attached to the HTTP server
// const wss = new WebSocket.Server({ server });

// // WebSocket connection to the data provider with user key
// const dataProviderWebSocket = new WebSocket(
//   "wss://marketdata.tradermade.com/feedadv",
//   {
//     headers: {
//       // Include the user key in the WebSocket request headers
//       Authorization: `Bearer ${USER_KEY}`,
//     },
//   }
// );

// // Listen for WebSocket connections from clients
// wss.on("connection", (clientWebSocket) => {
//   console.log("Client connected");

//   // Forward messages from the client to the data provider
//   clientWebSocket.on("message", (message) => {
//     console.log("Received from client:", message);
//     dataProviderWebSocket.send(message);
//   });

//   // Forward messages from the data provider to the client
//   dataProviderWebSocket.on("message", (message) => {
//     console.log("Received from data provider:", message);

//     // Check if the message is a Blob
//     if (message instanceof Buffer) {
//       // Convert Blob to JSON assuming it's in string format
//       const jsonData = message.toString("utf-8");
//       clientWebSocket.send(jsonData);
//     } else {
//       // Forward non-Blob data as-is
//       clientWebSocket.send(message);
//     }
//   });

//   // Handle WebSocket disconnection
//   clientWebSocket.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// // Start the HTTP server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`WebSocket proxy server is listening on port ${PORT}`);
// });
