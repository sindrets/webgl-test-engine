const path = require("path");
const fs = require("fs");

const mode = process.env.NODE_ENV || "development";
const wteFileName = "webgl-test-engine.js";

module.exports = [
	{
		entry: "./src/Main.ts",
		mode,
		devtool: mode == "development" ? "inline-source-map" : "none",
		module: {
			rules: [{ test: /\.tsx?/, loader: "ts-loader" }],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
		},
		output: {
			filename: wteFileName,
			path: path.resolve("./out/dist"),
			library: "wte",
			libraryTarget: "window",
		},
		plugins: [
			{
				apply: compiler => {
					compiler.hooks.done.tap("PostPlugin", compilation => {
						const src = path.resolve(__dirname, "out/dist", wteFileName);
						const target = path.resolve(__dirname, "demo/out", wteFileName);
						fs.mkdirSync(path.dirname(target), { recursive: true });
						fs.copyFileSync(src, target);
					});
				},
			},
		],
	},
	{
		entry: "./demo/src/app.ts",
		mode,
		devtool: mode == "development" ? "inline-source-map" : "none",
		module: {
			rules: [
				{
					test: /\.tsx?/,
					loader: "ts-loader",
					options: {
						context: path.resolve("./demo"),
						configFile: path.resolve("./demo/tsconfig.json"),
					},
				},
			],
		},
		resolve: {
			extensions: [".tsx", ".ts", ".js"],
		},
		output: {
			filename: "app.js",
			path: path.resolve("./demo/out"),
		},
	},
];
