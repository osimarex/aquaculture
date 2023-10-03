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

  useEffect(() => {
    const ws = new WebSocket("wss://marketdata.tradermade.com/feedadv");

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
      ws.send(
        JSON.stringify({
          userKey: "wshq6U4xzFH3pFQy_EFA",
          symbol: "CHFNOK,GBPNOK,NOKGBP,EURNOK,EURUSD,DKKNOK,NOKSEK,USDNOK",
        })
      );
      console.log("Sent user key and symbol.");
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      const dataStr = event.data.toString();
      try {
        const parsedData = JSON.parse(dataStr) as WebSocketData;
        const { symbol } = parsedData;

        if (symbol === "USDNOK" || symbol === "EURNOK" || symbol === "CHFNOK") {
          setData((prevData) => ({
            ...prevData,
            [symbol]: parsedData,
          }));
        }
      } catch (e) {
        console.log("Error parsing JSON:", e);
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  return data;
};

export default useWebSocket;
