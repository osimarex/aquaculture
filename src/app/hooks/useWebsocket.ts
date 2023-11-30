import { useEffect, useState } from "react";

type WebSocketData = {
  signal: null;
  symbol: string;
  bid: number;
  ask: number;
  ts: number;
};

const useWebSocket = () => {
  const [data, setData] = useState<Record<string, WebSocketData | null>>({
    USDNOK: null,
    EURNOK: null,
    CHFNOK: null,
  });

  useEffect(() => {
    // const ws = new WebSocket("ws://localhost:3000");
    const wsUrl =
      window.location.hostname === "localhost"
        ? "ws://localhost:3000"
        : "wss://imarexdevapp-staging.azurewebsites.net";

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      // Send initial configuration or any other WebSocket actions
      ws.send(
        JSON.stringify({
          userKey: process.env.NEXT_PUBLIC_WEBSOCKET_USER_KEY,
          symbol: "CHFNOK,EURNOK,USDNOK",
        })
      );
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);

      if (typeof event.data === "string") {
        // Handle JSON data
        const dataStr = event.data.toString();
        try {
          const parsedData = JSON.parse(dataStr) as WebSocketData;
          const { symbol } = parsedData;
          setData((prevData) => ({
            ...prevData,
            [symbol]: parsedData,
          }));
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else if (event.data instanceof Blob) {
        // Handle Blob data (e.g., display or store it)
        console.log("Received Blob data. Size:", event.data.size);
      } else {
        // Handle other data types, if necessary
        console.error("Received unsupported data type:", event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Handle the WebSocket closure as needed
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, []);

  return data;
};

export default useWebSocket;
