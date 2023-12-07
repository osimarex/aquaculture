module.exports = {
  apps: [
    {
      name: "NextApp",
      script: "./start-next.js",
      watch: false,
    },
    {
      name: "WebSocketServer",
      script: "./server.js",
      watch: false,
    },
  ],
};
