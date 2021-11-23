import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TenonWebpackPlugin } from 'tenon-webpack-plugin'

import type { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import { externals, cdnFiles } from './externals';

const { NODE_ENV } = process.env;

const plugins = NODE_ENV === 'development' ? [] : [
  new TenonWebpackPlugin({
    blocks: ["React17App"],
    externals: {
      js: cdnFiles.js,
      css: cdnFiles.css,
    },
  }),
]

export default (): Configuration => {
  const config: Configuration = {
    entry: NODE_ENV === 'development' ? './src/main.tsx' : './src/entry.tsx',
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'static/[name]_[hash:8].js',
      path: path.resolve(__dirname, '../main/public/react17App'),
      publicPath: NODE_ENV === 'development' ? '/' : 'http://localhost:7001/react17App/',
      globalObject: 'window',
      library: 'react17AppBlocks',
      libraryExport: 'default', // 对应 ./index.ts 中导出的变量
      libraryTarget: 'umd', // 暴露全局变量
    },
    resolve: {
      modules: ['node_modules'],
      alias: {
        '@': path.resolve(__dirname, './src/'),
        "@typings": path.resolve(__dirname, './typings/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.md'],
    },
    externals: externals,
    devServer: {
      port: '7005',
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      hot: true,
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
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        cdnFiles: {
          css: cdnFiles.css.map(src => `<link rel="stylesheet" type="text/css" href="${src}">`).join(''),
          js: cdnFiles.js.map(src => `<script rel="preload" src="${src}"></script>`).join(''),
        },
        inject: 'body',
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[hash:8].css',
        chunkFilename: 'static/[name].[hash:8].css',
      }),
      ...plugins
    ]
  }
  return config
}
