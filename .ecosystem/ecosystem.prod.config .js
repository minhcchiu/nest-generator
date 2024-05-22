module.exports = {
	apps: [
		{
			name: "awesome-nest-be-production",
			script: "dist/main.js",
			instances: 1,
			autorestart: true,
			watch: false,
			time: true,
			cwd: "/home/awesome-nest-be-production/current",
			error_file: "/home/awesome-nest-be-production/logs/web.err.log",
			out_file: "/home/awesome-nest-be-production/logs/web.out.log",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production",
			},
		},
	],
	deploy: {
		production: {
			user: "root",
			host: ["3.0.177.112"],
			ref: "origin/develop",
			repo: "git@github.com:himinh/awesome-nest-generator-2023.git",
			path: "/home/awesome-nest-be-production",
			"post-deploy":
				"pnpm install && pnpm build && pm2 reload '.ecosystem/ecosystem.prod.config.js' --env production",
			ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
		},
	},
};
