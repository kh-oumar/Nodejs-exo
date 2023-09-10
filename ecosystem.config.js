module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3,
      max_memory_restart: "200M",
      env_production: {
        NODE_ENV: "production",
      },
      log_type: "json",
      error_file: "./logs/err.log",
      combine_logs: true,
      merge_logs: true,
    },
  ],
};
