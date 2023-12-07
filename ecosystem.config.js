module.exports = {
  apps: [
    {
      name: "NextApp",
      script: "npm",
      args: "run start",
      watch: false,
    },
    {
      name: "WebSocketServer",
      script: "./server.js",
      watch: false,
    },
  ],
};
