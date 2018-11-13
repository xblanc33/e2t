const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: {
        background: './src/background.js',
        popup: './src/ui/Popup.jsx',
        listener: './src/listener.js'
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
            { from: './src/popup.html', to: 'popup.html' }
        ]),
    ]
};