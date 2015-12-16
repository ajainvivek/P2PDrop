import Ember from "ember";
var inject = Ember.inject;

export default Ember.Controller.extend({
  webrtc : inject.service(),
  init : function () {
    //this.get("webrtc").initialize();
  }
});
