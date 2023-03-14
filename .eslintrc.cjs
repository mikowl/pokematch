module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["preact"],
	overrides: [
		{
			files: [
				"**/*.js",
				"**/*.ts",
				"**/*.tsx",
			],
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
	plugins: [
		"eslint-plugin-import",
	],
	rules: {
		"import/consistent-type-specifier-style": [
			"error",
			"prefer-inline",
		],
		indent: [
			"error",
			"tab",
		],
		"max-len": "off",
		'no-mixed-spaces-and-tabs': 'warn',
		'no-nested-ternary': 'warn',
		'no-tabs': 'off',
		'no-ternary': 'off',
		'object-curly-newline': 'off',
		"prefer-const": "error",

		"react/self-closing-comp": [
			"error",
			{ component: true,
				html: true },
		],
	},
};