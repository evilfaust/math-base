// pm2 config — используется на VPS
module.exports = {
  apps: [
    {
      name: "math-base",
      script: "npm",
      args: "start",
      cwd: "/var/www/math-base",
      env: {
        NODE_ENV: "production",
        PORT: 3042,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
