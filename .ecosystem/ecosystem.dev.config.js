module.exports = {
	apps: [
		{
			name: "as-develop",
			script: "dist/main.js",
			instances: 1,
			autorestart: true,
			watch: false,
			time: true,
			max_memory_restart: "1G",
			cwd: "/home/ubuntu/as-develop/source",
			error_file: "/home/ubuntu/as-develop/logs/web.err.log",
			out_file: "/home/ubuntu/as-develop/logs/web.out.log",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "development",
			},
			env_development: {
				NODE_ENV: "development",
			},
		},
	],
};
