const path = require('path');
const { TenonWebpackPlugin } = require('tenon-webpack-plugin');

module.exports = {
  pages: {
    index: {
      entry: 'src/components/entry.js' // 把src 修改为examples
    }
  },
  outputDir: path.resolve(__dirname, '../main/public/vue3'),
  publicPath: 'http://localhost:7001/vue3/',
  // productionSourceMap: process.env.NODE_ENV === 'development',
  configureWebpack: {
    mode: 'development',
    devtool: 'source-map',
    output: {
      globalObject: 'window',
      library: 'Vue3Blocks',
      libraryExport: 'default', // 对应 ./index.ts 中导出的变量
      libraryTarget: 'umd' // 暴露全局变量
    },
    plugins: [
      new TenonWebpackPlugin({
        blocks: ['ChartLine']
      })
    ]
  },
}
