import Ember from 'ember';

export default Ember.Component.extend({
  isFileSelected: false,
  name: "",
  url: "",
  didInsertElement : function () {
    var self = this;
    p2p.pubsub.subscribe("notify-action-bar", this, function (data) {
      self.set("isFileSelected", true);
      self.set("name", data.name);
      self.set("url", data.url);
    });
  },
  actions: {
  }
});
