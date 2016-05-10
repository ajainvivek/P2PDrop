/* jshint node: true */

/**
* Set your custom configuration here
**/
var config = {
  firebase : "https://p2pdrop.firebaseio.com/",
  imgur : "644aded71822622",
  googleAnalytics : "UA-76504263-1",
  emailServer : "https://p2pdrop-service.herokuapp.com/email",
  signallingServer : "https://p2pdrop-signalling.herokuapp.com/"
};

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'p2pdrop',
    environment: environment,
    signallingServer: config.signallingServer,
    emailServer: config.emailServer,
    contentSecurityPolicy: { 'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com" },
    firebase: config.firebase,
    'simple-auth': {
      serverTokenRevocationPoint: '/revoke',
      authenticationRoute: 'signin',
      routeAfterAuthentication: 'home',
      routeIfAlreadyAuthenticated: 'home'
    },
    imgur: {
      clientId: config.imgur
    },
    moment: {
      outputFormat: 'll'
    },
    baseURL: '/',
    isDesktop: process.env.EMBER_CLI_ELECTRON ? true : false,
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    serviceWorker : {
      enabled: true,
      debug: true,
      excludePaths: ['manifest.appcache']
    },
    manifest : {
      enabled: true,
      appcacheFile: '/manifest.appcache',
      excludePaths: ['index.html', 'tests/index.html', 'robots.txt', 'crossdomain.xml', 'testem.js'],
      showCreateDate: true
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy : {
      'default-src': "'none'",
  	  'style-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://s-usc1c-nss-140.firebaseio.com/",
      'img-src': "'self' http://i.imgur.com/",
      'connect-src': "'self' http://fonts.gstatic.com wss://*.firebaseio.com https://*.firebase.com https://sandbox.simplewebrtc.com/socket.io/* wss://tracker.btorrent.xyz/ https://p2pdrop-signalling.herokuapp.com wss://p2pdrop-signalling.herokuapp.com https://s-usc1c-nss-140.firebaseio.com/",
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
    ENV.serviceWorker.debug = false;
    ENV.locationType = 'hash';
    ENV.baseURL = '/p2pdrop/';
    ENV.googleAnalytics = {
      webPropertyId: config.googleAnalytics
    };
  }

  return ENV;
};
