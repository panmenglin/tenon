const path = require('path');
const { TenonWebpackPlugin } = require('tenon-webpack-plugin');

const { NODE_ENV, BUILD_ENV } = process.env;

module.exports = {
  pages: {
    index: {
      entry:
        NODE_ENV === 'development' ? 'src/main.js' : 'src/components/entry.js',
    },
  },
  devServer: { port: 7007 },
  outputDir: path.resolve(
    __dirname,
    NODE_ENV === 'development' ? './dist' : BUILD_ENV === 'origin' ? path.resolve(__dirname, '../main/dist/vue') : path.resolve(__dirname, '../main/public/vue'),
  ),
  publicPath: NODE_ENV === 'development' ? '/' : BUILD_ENV === 'origin' ? 'https://panmenglin.github.io/tenon-examples/vue/' : 'http://localhost:7001/vue/',
  configureWebpack: {
    mode: 'development',
    devtool: 'source-map',
    output: {
      globalObject: 'window',
      library: 'VueBlocks',
      libraryExport: 'default',
      libraryTarget: 'umd',
    },
    plugins: [
      new TenonWebpackPlugin({
        blocks: ['ChartLine'],
      }),
    ],
  },
};
