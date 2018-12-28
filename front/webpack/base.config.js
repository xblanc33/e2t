const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

var config = {
	context: path.resolve(__dirname, '..'),
	entry: {
		'app/js/app': './dev/app/js/App.jsx'
	},
	output: {
		path: path.resolve(__dirname, '../ops'),
		filename: '[name].bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			include: path.resolve(__dirname, '../dev/app'),
			use: 'babel-loader'
		}]
	},
	plugins: [
		new CopyPlugin([
			{from: './dev/app/index.html', to: 'app/index.html'},
			{from: './dev/app/google5d1e299f83dd09ef.html', to: 'app/google5d1e299f83dd09ef.html'}
		])
	]
};

module.exports = config;
