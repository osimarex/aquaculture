module.exports = {
  apps: [
    {
      name: "NextApp",
      script: "next",
      args: "start",
      watch: false,
    },
    {
      name: "WebSocketServer",
      script: "./server.js",
      watch: false,
    },
  ],
};
