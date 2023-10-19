import { useEffect, useState } from "react";

type WebSocketData = {
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
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(
        process.env.WEBSOCKET_URL || "wss://marketdata.tradermade.com/feedadv"
      );

      ws.onopen = () => {
        console.log("WebSocket connection opened.");
        ws.send(
          JSON.stringify({
            userKey: process.env.NEXT_PUBLIC_WEBSOCKET_USER_KEY,
            symbol: "CHFNOK,EURNOK,USDNOK",
          })
        );
        console.log("Sent user key and symbol.");
      };

      ws.onmessage = (event) => {
        // console.log("event data:", event.data);
        const dataStr = event.data.toString();
        try {
          if (isJSON(dataStr)) {
            const parsedData = JSON.parse(dataStr) as WebSocketData;
            const { symbol } = parsedData;
            setData((prevData) => ({
              ...prevData,
              [symbol]: parsedData,
            }));
          } else {
            console.log("Received non-JSON message:", dataStr);
          }
        } catch (e) {
          console.log("Error parsing JSON:", e);
        }
      };

      function isJSON(str: string): boolean {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

      ws.onerror = (error) => {
        console.log("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
        if (reconnectAttempts < 5) {
          // set a limit for reconnection attempts
          setTimeout(connect, 3000); // try reconnecting after 3 seconds
          setReconnectAttempts(reconnectAttempts + 1);
        }
      };

      return () => {
        ws.close();
      };
    };

    connect();
  }, [reconnectAttempts]);

  return data;
};

export default useWebSocket;
