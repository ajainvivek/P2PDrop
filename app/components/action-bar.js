import Ember from 'ember';
var inject = Ember.inject;

export default Ember.Component.extend({
  isFileSelected: false,
  name: "",
  url: "",
  ips: inject.service(),
  localIp: "",
  didInsertElement : function () {
    var self = this;
    p2p.pubsub.subscribe("notify-action-bar", this, function (data) {
      self.set("isFileSelected", true);
      self.set("name", data.name);
      self.set("url", data.url);
    });
    this.get("ips").getLocalIps().then(function (data) {
      self.set("localIp", data[0]);
    });
  },
  actions: {
  }
});
