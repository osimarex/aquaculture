const WebSocket = require("ws");
const http = require("http");

// Your user key
const USER_KEY = process.env.NEXT_PUBLIC_WEBSOCKET_USER_KEY || "your-user-key";

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket proxy server is running");
});

// Handle HTTP server errors
server.on("error", (error) => {
  console.error("HTTP Server Error:", error);
});

// Create a WebSocket server attached to the HTTP server
// const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({ server, perMessageDeflate: false });

// Handle errors on the WebSocket server
wss.on("error", (error) => {
  console.error("WebSocket Server Error:", error);
});

// WebSocket connection to the data provider with user key
const dataProviderWebSocket = new WebSocket(
  "wss://marketdata.tradermade.com/feedadv",
  {
    headers: {
      Authorization: `Bearer ${USER_KEY}`,
    },
  }
);

// Handle errors in the data provider WebSocket
dataProviderWebSocket.on("error", (error) => {
  console.error("DataProvider WebSocket Error:", error);
});

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
  connectedClients++;
  console.log(`Connected clients: ${connectedClients}`);

  clientWebSocket.on("error", (error) => {
    console.error("Error in client WebSocket connection:", error);
  });

  clientWebSocket.on("message", (message) => {
    console.log("Received from client:", message);
    dataProviderWebSocket.send(message);
  });

  dataProviderWebSocket.on("message", (message) => {
    const jsonData = message.toString("utf-8");
    broadcast(jsonData);
  });

  clientWebSocket.on("close", (code, reason) => {
    console.log("Client disconnected with code:", code, "and reason:", reason);
    connectedClients--;
    console.log(`Connected clients: ${connectedClients}`);
  });
});

// Start the HTTP server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket proxy server is listening on port ${PORT}`);
});
