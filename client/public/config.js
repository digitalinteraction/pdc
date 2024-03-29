// Set global config for the deployment
// to be overwritten in production
window.CONFIG = {
  SELF_URL: 'http://localhost:8080/',
  SERVER_URL: 'http://localhost:3000/',
  BUILD_NAME: '',
  // GA_TOKEN: 'G-JRVVR708J7', // development/testing token
  GA_TOKEN: '',
  JWT_ISSUER: 'pdc-2022-dev',
  DISABLE_SOCKETS: false,
  STATIC_BUILD: false,
}

//
// Static mode
//
// window.CONFIG.SERVER_URL = 'https://schedule.pdc2022.org/schedule/'
// window.CONFIG.STATIC_BUILD = true
// window.CONFIG.DISABLE_SOCKETS = true
