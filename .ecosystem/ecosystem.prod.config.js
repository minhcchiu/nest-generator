module.exports = {
  apps: [
    {
      name: "asnest-prod",
      script: "dist/main.js",
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      max_memory_restart: "1G",
      cwd: "D:\\asnest-prod\\source", // Đường dẫn thư mục làm việc
      error_file: "D:\\asnest-prod\\logs\\web.err.log", // Đường dẫn file log lỗi
      out_file: "D:\\asnest-prod\\logs\\web.out.log", // Đường dẫn file log output
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
