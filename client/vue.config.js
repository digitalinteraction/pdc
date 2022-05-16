const { defineConfig } = require('@vue/cli-service')

//
// @vue/cli-service configuration
// see: https://cli.vuejs.org/config/#global-cli-config
//

// Put the package version into the vue app with an environment variable
process.env.VUE_APP_NAME = require('./package.json').name
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = defineConfig({
  lintOnSave: true,
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/scss/common.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    // Use non-standard yaml
    config.resolve.extensions.add('.yml').add('.yaml')

    // prettier-ignore
    // load yaml data in and convert into javascript objects
    config.module
      .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('yaml-loader')
        .loader('yaml-loader')
        .end()

    // Use the slim socket.io in production
    config.resolve.alias.set(
      'socket.io-client',
      process.env.NODE_ENV === 'development'
        ? 'socket.io-client'
        : 'socket.io-client/dist/socket.io.min.js'
    )
  },
})
