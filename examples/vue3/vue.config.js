const path = require('path');
const { TenonWebpackPlugin } = require('tenon-webpack-plugin');

const { NODE_ENV } = process.env;

module.exports = {
  pages: {
    index: {
      entry:
        NODE_ENV === 'development' ? 'src/main.js' : 'src/components/entry.js',
    },
  },
  devServer: { port: 7009 },
  outputDir: path.resolve(
    __dirname,
    NODE_ENV === 'development' ? './dist' : '../main/public/vue3'
  ),
  publicPath: NODE_ENV === 'development' ? '/' : 'http://localhost:7001/vue3/',
  configureWebpack: {
    mode: 'development',
    devtool: 'source-map',
    output: {
      globalObject: 'window',
      library: 'Vue3Blocks',
      libraryExport: 'default',
      libraryTarget: 'umd'
    },
    plugins: [
      new TenonWebpackPlugin({
        blocks: ['ChartLine']
      })
    ]
  },
}
