import Ember from "ember";
import config from '../config/environment';
import _array from 'lodash/array';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  isPendingApprovals : false,
  pendingApprovals : [],
  getPendingApprovals : function () {
    const uid = this.get('session.secure.uid');
    let userRef = new Firebase(config.firebase + '/users/' + uid);
    let self = this;

    return new Promise(function (resolve, reject) {
      userRef.on("value", function(snapshot) {
        let user = snapshot.val();
        if (user.friends.pending.length) {
          self.set("isPendingApprovals", true);
        } else {
          self.set("isPendingApprovals", false);
        }
        resolve(user.friends.pending);
      });
    });
  },
  actions : {
    approve(user) {
      console.log(user);
    },
    reject(user) {
      console.log(user);
    }
  }

});
