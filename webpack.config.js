var path = require('path')
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",//和上面配置的入口对应
        //filename: "commonFun.js",//导出的文件的名称
        minChunks: 2,
    }),
    new ExtractTextPlugin('css/styles.[contenthash].css'),
    new HtmlWebpackPlugin({
        title: 'My App',
        filename: 'index.html',
        template:'index.html'
    })

]
if (process.env.NODE_ENV === 'production'){
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        })
    )
} else {
}

module.exports = {
    entry: {
        app: ['babel-polyfill','./src/main.js'],
        vendor: ['vue','vuex']
    },//值可以是字符串、数组或对象

    output: {
        path: path.resolve(__dirname, './dist'),//Webpack结果存储
        publicPath: '/',
        filename: 'js/[name].[hash:8].js',
        chunkFilename:'js/[name].[hash:8].js'
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                        extractCSS: true
                    // other vue-loader options go here
                }
            },
            { test: /iview.src.*?js$/, loader: 'babel-loader' },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
                //include: [path.resolve(__dirname, '/src')]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
            ,
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    }, "sass-loader"]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    }, "less-loader"]
                })
            }
        ]

    },
    resolve: {
        extensions: ['.js','.less', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ]
    },
    devServer: {//webpack-dev-server配置热更新以及跨域
        historyApiFallback: true,//不跳转
        noInfo: true,
        inline: true,//实时刷新
        port: '5000',
        proxy: {
            '/list': {
                target: 'http://lol.qq.com/web201310/js/videodata/LOL_VIDEOLIST_IDX3.js',
                pathRewrite: {'^/list': ''},
                changeOrigin: true,
                secure: false
            }
        }
    },
    devtool: false
}



