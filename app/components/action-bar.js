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
    this.set("actionContext", this);
    this.get("ips").getLocalIps().then(function (data) {
      console.log(data);
      self.set("localIp", data[0]);
    });
  },
  notifyFileSelect : function (data) {
    this.set("isFileSelected", true);
    this.set("name", data.name);
    this.set("url", data.url);
  },
  actions: {

  }
});
