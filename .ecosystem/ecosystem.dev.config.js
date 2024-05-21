module.exports = {
	apps: [
		{
			name: "awesome-nest-be-development",
			script: "dist/main.js",
			instances: 1,
			autorestart: true,
			watch: false,
			time: true,
			cwd: "/home/awesome-nest-be-development/current",
			error_file: "/home/awesome-nest-be-development/logs/web.err.log",
			out_file: "/home/awesome-nest-be-development/logs/web.out.log",
			exec_mode: "cluster",
			env: {
				NODE_ENV: "development",
			},
		},
	],

	deploy: {
		develop: {
			user: "root",
			host: ["13.215.154.137"],
			ref: "origin/develop",
			repo: "git@github.com:himinh/awesome-nest-generator-2023.git",
			path: "/home/awesome-nest-be-development",
			"post-deploy":
				"npm install && npm build && pm2 reload '.ecosystem/ecosystem.dev.config.js' --env development",
			ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
		},
	},
};
