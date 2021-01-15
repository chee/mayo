let path = require("path")

module.exports = {
	entry: "./src/mayo.ts",
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
		fullySpecified: false,
	},
	output: {
		filename: "mayo.js",
		path: path.resolve(__dirname, "dist"),
	},
}
