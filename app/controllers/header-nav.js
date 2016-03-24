import Ember from "ember";
import config from '../config/environment';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  session: inject.service('session'),
  spinner: inject.service('spinner'),
  pendingApprovals: 0,
  isPendingApprovals: false,
  init : function () {
    let self = this;
    this.get("session").on('invalidationSucceeded', function() { //TODO: Not Routing On Desktop App
      window.location.reload();
    });
    this.getPendingApprovals().then(function (data) {
      if (data.length > 0) {
        self.set("pendingApprovals", data.length);
        self.set("isPendingApprovals", true);
      } else {
        self.set("pendingApprovals", data.length);
        self.set("isPendingApprovals", false);
      }
    });
  },
  getPendingApprovals : function () {
    const uid = this.get('session.secure.uid');
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    let self = this;

    return new Promise(function (resolve, reject) {
      userRef.on("value", function(snapshot) {
        let user = snapshot.val();
        let friends = user.friends || {};
        let pending = friends.pending || [];
        if (user.friends && user.friends.pending && user.friends.pending.length) {
          self.set("isPendingApprovals", true);
        } else {
          self.set("isPendingApprovals", false);
        }
        resolve(pending);
      });
    });
  },
  actions: {
    logout: function() {
        this.get("spinner").show("app-spinner");
        this.get('session').invalidate().then(function() {
            this.get("spinner").hide("app-spinner");
            this.transitionToRoute('signin');
            if (config.locationType === "hash") { //Refresh for desktop application
              window.location.reload(false);
            }
        }.bind(this));
    }
  }
});
