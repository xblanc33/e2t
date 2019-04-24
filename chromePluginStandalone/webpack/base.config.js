const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: {
        background: './src/Background/background.js',
        popup: './src/PluginUI/Popup.jsx',
        listener: './src/BrowserPage/pageContent.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, '../src'),
            use: 'babel-loader'
        }]
    },
    plugins: [
        new CopyPlugin([
            { from: './src/manifest.json', to: 'manifest.json' },
            { from: './src/images/plugin_icon.png', to: 'images/plugin_icon.png' },
            { from: './src/PluginUI/popup.html', to: 'popup.html' },
            { from: './src/css/bootstrap.min.css', to: 'css/bootstrap.min.css' },
            { from: './src/css/bootstrap-theme.min.css', to: 'css/bootstrap-theme.min.css' },
            { from: './src/css/bootstrap2-toggle.css', to: 'css/bootstrap2-toggle.css' }
        ]),
    ]
};