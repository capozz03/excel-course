const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';
    const isDev = !isProd;

    const filename = (ext) => isProd ?
    `[name].[contenthash].bundle.${ext}` :
    `[name].bundle.${ext}`;

    const plugins = () => {
        const base = [
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
            new FaviconsWebpackPlugin({
                logo: path.resolve(__dirname, 'src/assets', 'favicon.svg'),
            }),
            new MiniCssExtractPlugin({
                filename: filename('css'),
            }),
        ]

        if (isDev) {
            base.push(new ESLintPlugin())
        }

        return base
    }

    console.log(argv.mode)
    return {
        target: 'web',
        context: path.resolve(__dirname, 'src'),
        entry: {
            main: ['core-js/stable',
            'regenerator-runtime/runtime',
            './index.js',
            ],
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: filename('js'),
            clean: true,
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@core': path.resolve(__dirname, 'src', 'core'),

            },
        },
        devServer: {
            port: env.port, // from package.json
            open: true,
            hot: true,
            watchFiles: './',
        },
        devtool: isDev ? 'source-map' : false,
        plugins: plugins(),
        module: {
            rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
                },
            },
            ],
        },
    }
}
