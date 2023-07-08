module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"chore",
				"style",
				"refactor",
				"ci",
				"test",
				"revert",
				"perf",
				"build",
				"vercel",
			],
		],
		"subject-full-stop": [0, "never"],
		"subject-case": [0, "never"],
	},
};
