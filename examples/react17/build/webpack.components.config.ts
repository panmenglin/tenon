import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import type { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";


import { TenonWebpackPlugin } from 'tenon-webpack-plugin'
import { externals, cdnFiles } from './externals';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const { NODE_ENV } = process.env;

export default (): Configuration => {
  const config: Configuration = {
    entry: './src/components/entry.tsx',
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'index.min.js',
      path: path.resolve(__dirname, '../../main/public/react17'),
      publicPath: 'http://localhost:7001/react17/',
      globalObject: 'window',
      library: 'TBBlocks',
      libraryExport: 'default', // 对应 ./index.ts 中导出的变量
      libraryTarget: 'umd', // 暴露全局变量
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src/'),
      },
      // 支持查询模块文件类型
      // 例如：如果不写 tsx 文件中使用 import xxx from './xxx' 则不会引入 app.tsx
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    },
    externals: externals[NODE_ENV],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
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
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash:8].css',
        chunkFilename: '[name].[hash:8].css',
      }),
      new TenonWebpackPlugin({
        blocks: ["UserInfo", "ChartLine"],
        externals: {
          js: cdnFiles[NODE_ENV].js,
          css: cdnFiles[NODE_ENV].css,
        },
      }),
    ],
  }

  return config
}
