import webpack from 'webpack';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const CopyWebpackPlugin = require('copy-webpack-plugin');

const useBrowser = process.env.BROWSER != 'none';

import type { Configuration } from 'webpack'

export default (): Configuration => {
  const config: Configuration = {
    mode: 'development',
    entry: {
      index: './src/main.tsx', // 导出生命周期的 js 需要放在最后
    },
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
    output: {
      // filename: 'static/[name]_[hash:8].js',
      // path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
    },
    resolve: {
      modules: ['node_modules'],
      alias: {
        '@': path.resolve(__dirname, '../src/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss'],
    },
    devServer: {
      port: 7003,
      // historyApiFallback: true, // 需要与 publicPath: '/', 配合使用，404指向 index.html
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      // },
      // hot: true,

      disableHostCheck: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      compress: true,
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
            MiniCssExtractPlugin.loader,
            'css-loader'],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: {
                  '@layout-header-background': '#fff',
                  '@layout-footer-background': '#fff',
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
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html', //打包后的文件名
        inject: 'body', // 指定 js 插入位置
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[hash:8].css',
        chunkFilename: 'static/[name].[hash:8].css',
      }),
      new CleanWebpackPlugin({}),
    ],
  };

  return config
}

