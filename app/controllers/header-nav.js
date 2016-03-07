import Ember from "ember";

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service('session'),
  init : function () {
    this.get("session").on('invalidationSucceeded', function() { //TODO: Not Routing On Desktop App
      window.location.reload();
    });
  },
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
