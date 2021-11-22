import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import type { Configuration } from 'webpack'

import { TenonWebpackPlugin } from 'tenon-webpack-plugin'

export default (): Configuration => {
  const config: Configuration = {
    entry: './src/components/entry.tsx',
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'index.min.js',
      path: path.resolve(__dirname, '../../main/public/react16'),
      publicPath: 'http://localhost:7001/react16/',
      globalObject: 'window',
      library: 'React16Blocks',
      libraryExport: 'default',
      libraryTarget: 'umd',
    },
    resolve: {
      modules: ['node_modules'],
      alias: {
        '@': path.resolve(__dirname, '../src/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
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
        filename: 'index.html',
        inject: 'body',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash:8].css',
        chunkFilename: '[name].[hash:8].css',
      }),
      new TenonWebpackPlugin({
        blocks: ["UserInfo", "ChartLine"],
      }),
      new CleanWebpackPlugin({}),
    ],
  };

  return config
}
