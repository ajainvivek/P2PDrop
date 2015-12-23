import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

var PubSub = Ember.Object.extend(Ember.Evented, {
  publish: function() {
    return this.trigger.apply(this, arguments);
  },
  subscribe: function() {
    return this.on.apply(this, arguments);
  },
  unsubscribe: function() {
    return this.off.apply(this, arguments);
  }
});

window.p2p = {};

window.p2p.pubsub = PubSub.create();

loadInitializers(App, config.modulePrefix);

export default App;
