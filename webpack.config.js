const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './src/react_js/main/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),

        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            {
                test: /\.html$/i,
                use: ['html-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    optimization: {
        usedExports: true,
        minimize: true,
    },
};

module.exports = () => {
    return config;
};
