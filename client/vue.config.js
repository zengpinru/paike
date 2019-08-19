const path = require('path')

const resolve = dir => path.join(__dirname, dir)

const PUBLIC_PATH = process.env.NODE_ENV === 'production' ? './' : '/'

module.exports = {
  publicPath: PUBLIC_PATH,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))
      .set('api', resolve('src/api'))
    config.module
      .rule('vue')
      .use('iview-loader')
      .loader('iview-loader')
      .tap(options => {
        return {
          prefix: true
        }
      })
  }
  // configureWebpack: {
  //   devtool: 'source-map'
  // }
  // devServer: {
  //   proxy: { 
  //     '/api/*': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true
  //     }
  //   }
  // }
}
