import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

import type { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const { NODE_ENV } = process.env;

export default (): Configuration => {
  const config: Configuration = {
    entry: './src/main.tsx',
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'static/[name]_[hash:8].js',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
        "@typings": path.resolve(__dirname, './typings/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.md'],
    },
    devServer: {
      port: '7001', //默认是8080
      historyApiFallback: true, // 需要与 publicPath: '/', 配合使用，404指向 index.html
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      hot: true,
      allowedHosts: [
        'localhost',
      ],
      proxy: {},
    },
    optimization: {
      // 每个入口添加一个只含有 runtime 的额外 chunk, 解决 md 文件更新 devServer hot 更新失败的问题
      runtimeChunk: 'single',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader'],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  modifyVars: {
                    '@layout-header-background': '#fff',
                    '@layout-footer-background': '#fff',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'images/[hash:8][name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin({}),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[hash:8].css',
        chunkFilename: 'static/[name].[hash:8].css',
      }),
      new webpack.DefinePlugin({
        __DEVTOOL: NODE_ENV === 'development' ? true : false,
      })
    ]
  }
  return config
}
