const path = require("path");

module.exports = [
	{
		entry: './src/Main.ts',
		devtool: 'inline-source-map',
		module: {
			rules: [
				{ test: /\.tsx?/, loader: "ts-loader" }
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		},
		output: {
			filename: 'webgl-test-engine.js',
			path: path.resolve("./out/dist"),
			library: "wte",
			libraryTarget: "window"
		}
	},
];
