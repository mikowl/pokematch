module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["eslint:all", "preact", "prettier"],
	overrides: [
		{
			files: ["**/*.js", "**/*.ts", "**/*.tsx"],
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	rules: {
		"max-lines": 0,
		"no-magic-numbers": "off",
		"no-var": "error",
		"one-var": "off",
	},
};
