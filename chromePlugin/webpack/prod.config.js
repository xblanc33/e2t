const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
    devtool: 'source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify('https://250.ip-37-59-110.eu'),
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ]
});