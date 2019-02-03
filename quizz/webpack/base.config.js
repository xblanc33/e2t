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
			{ from: './dev/app/css/bootstrap.min.css', to: 'app/css/bootstrap.min.css' },
            { from: './dev/app/css/bootstrap-theme.min.css', to: 'app/css/bootstrap-theme.min.css' },
            { from: './dev/app/css/bootstrap2-toggle.css', to: 'app/css/bootstrap2-toggle.css' }
		])
	]
};

module.exports = config;
