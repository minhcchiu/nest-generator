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
			cwd: "/home/as-develop/current",
			error_file: "/home/as-develop/logs/web.err.log",
			out_file: "/home/as-develop/logs/web.out.log",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "development",
			},
			env_development: {
				NODE_ENV: "development",
			},
		},
	],
	deploy: {
		develop: {
			user: "ubuntu",
			host: ["18.141.176.61"],
			ref: "origin/develop",
			repo: "git@github.com:himinh/awesome-nest-generator-2023.git",
			path: "/home/as-develop",
			"pre-setup": "mkdir -p /home/as-develop/source",
			"post-deploy":
				"pnpm install && pnpm run build && pm2 reload ecosystem.dev.config.js --env development",
			ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
		},
	},
};
