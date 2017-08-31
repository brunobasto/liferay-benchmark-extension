const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		background: './app/src/background.js',
		content: './app/src/content.js',
		popup: './app/src/popup.js'
	},
	module: {
		loaders: [
            // ...
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ],
		rules: [
			{
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                loader: 'url-loader'
            },
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						compact: false,
						presets: ['babel-preset-es2015'],
						plugins: ['babel-plugin-transform-node-env-inline']
					}
				}
			},
			{
			  test: /\.scss$/,
			  loaders: ['style-loader', 'css-loader', 'sass-loader']
			} 
		]
	},
	output: {
		filename: 'app/build/[name].js'
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin("[name].css")
	]
};