module.exports = {
  apps: [
    {
      name: "NextApp",
      script: "npm",
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
