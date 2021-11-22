import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';


// import { name } from '../package.json';
// import { externals, cdnFiles } from './externals';

import type { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";


interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const { NODE_ENV } = process.env;

const plugins = [
  new HtmlWebpackPlugin({
    // title: '',
    template: './public/index.html',
    filename: 'index.html', //打包后的文件名
    cdnFiles: {
      css: '',
      // css: cdnFiles[NODE_ENV].css.map(src => `<link rel="stylesheet" type="text/css" href="${src}">`).join(''),
      js: '',
      // js: cdnFiles[NODE_ENV].js.map(src => `<script rel="preload" src="${src}"></script>`).join(''),
    },
    inject: 'body', // 指定 js 插入位置
  }),
  new MiniCssExtractPlugin({
    filename: 'static/[name].[hash:8].css',
    chunkFilename: 'static/[name].[hash:8].css',
  }),
  // new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin({
    __DEVTOOL: NODE_ENV === 'development' ? true : false,
    __LoginHost: NODE_ENV === 'development' ? `'http://test.ssa.jd.com/sso/login?ReturnUrl='` : `'http://ssa.jd.com/sso/login?ReturnUrl='`,
  }),
]

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      // components: './src/components/index.ts',
      doc: './src/main.tsx', // 导出生命周期的 js 需要放在最后
    },
    // mode: NODE_ENV === 'production' ? 'production' : 'development',
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'static/[name]_[hash:8].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      // library: 'react-components', // `${name}-[name]`,
      // libraryTarget: 'umd',
      // chunkLoadingGlobal: `webpackJsonp_${name}`,
      // globalObject: 'window',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src/'),
        "@typings": path.resolve(__dirname, '../typings/'),
      },
      // 支持查询模块文件类型
      // 例如：如果不写 tsx 文件中使用 import xxx from './xxx' 则不会引入 app.tsx
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.md'],
    },
    // externals: externals[NODE_ENV],
    devServer: {
      port: '7003', //默认是8080
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
          exclude: [
            path.resolve(__dirname, "../../../lib/")
          ],
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
    plugins: NODE_ENV !== 'production' ? plugins : [
      ...plugins,
      new CleanWebpackPlugin({}),
    ],
  }
  return config
}
