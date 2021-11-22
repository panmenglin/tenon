import webpack from 'webpack';
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

const plugins = [
  new TenonWebpackPlugin({
    blocks: ["UserInfo", "ChartLine"],
    externals: {
      js: cdnFiles[NODE_ENV].js,
      css: cdnFiles[NODE_ENV].css,
    },
  }),
]

export default (): Configuration => {
  const config: Configuration = {
    entry: NODE_ENV === 'development' ? './src/main.tsx' : './src/components/entry.tsx',
    mode: 'development',
    devtool: 'source-map',
    output: {
      // filename: 'static/[name]_[hash:8].js',
      // path: path.resolve(__dirname, '../dist'),
      // publicPath: '/',
      // library: 'react-components', // `${name}-[name]`,
      // libraryTarget: 'umd',
      // chunkLoadingGlobal: `webpackJsonp_${name}`,
      // globalObject: 'window',

      filename: 'index.min.js',
      path: path.resolve(__dirname, '../main/public/react17'),
      publicPath: NODE_ENV === 'development' ? '/' : 'http://localhost:7001/react17/',
      globalObject: 'window',
      library: 'TBBlocks',
      libraryExport: 'default', // 对应 ./index.ts 中导出的变量
      libraryTarget: 'umd', // 暴露全局变量
    },
    resolve: {
      modules: [path.join(__dirname, '../../'), 'node_modules'],
      alias: {
        '@': path.resolve(__dirname, '../src/'),
        "@typings": path.resolve(__dirname, '../typings/'),
        // '@share': path.resolve(__dirname, '../../share/'),
        '@yfe/components-react': path.resolve(__dirname, '../src/components'),
        '@ant-design/icons$': path.resolve(__dirname, './antd-icon.ts'),
      },
      // 支持查询模块文件类型
      // 例如：如果不写 tsx 文件中使用 import xxx from './xxx' 则不会引入 app.tsx
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.md'],
    },
    // externals: externals[NODE_ENV],
    devServer: {
      port: '7002', //默认是8080
      historyApiFallback: true, // 需要与 publicPath: '/', 配合使用，404指向 index.html
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      hot: true,
      allowedHosts: [
        'local.jd.com',
        'localhost',
      ],
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
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        cdnFiles: {
          css: cdnFiles.css.map(src => `<link rel="stylesheet" type="text/css" href="${src}">`).join(''),
          js: cdnFiles.js.map(src => `<script rel="preload" src="${src}"></script>`).join(''),
        },
        inject: 'body', // 指定 js 插入位置
      }),
      new MiniCssExtractPlugin({
        filename: 'static/[name].[hash:8].css',
        chunkFilename: 'static/[name].[hash:8].css',
      }),
    ]
  }
  return config
}
