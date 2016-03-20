/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'p2pdrop',
    environment: environment,
    contentSecurityPolicy: { 'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com" },
    firebase: 'https://p2pdrop.firebaseio.com/',
    'simple-auth': {
      serverTokenRevocationPoint: '/revoke',
      authenticationRoute: 'signin',
      routeAfterAuthentication: 'home',
      routeIfAlreadyAuthenticated: 'home'
    },
    imgur: {
      clientId: '644aded71822622'
    },
    moment: {
      outputFormat: 'll'
    },
    baseURL: '/',
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy : {
      'default-src': "'none'",
  	  'style-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'img-src': "'self' http://i.imgur.com/",
      'connect-src': "'self' http://fonts.gstatic.com wss://*.firebaseio.com https://*.firebase.com https://sandbox.simplewebrtc.com/socket.io/* wss://tracker.btorrent.xyz/ https://p2pdrop-signalling.herokuapp.com wss://p2pdrop-signalling.herokuapp.com",
      'font-src': "'self' https://fonts.gstatic.com"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
