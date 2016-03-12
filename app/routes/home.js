import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';

const {
  Route,
  inject
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  ips : inject.service("ips"),
  users : inject.service("users"),
  setupController : function (controller, model, queryParams) {
    let self = this;
    const uid = this.get('session.secure.uid');
    //on complete state change the state of btn
    let onComplete = function (error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        console.log('Synchronized');
      }
    };
    //Inject users network ip
    this.get("ips").getLocalIps().then(function (data) {
      let userRef = new Firebase(config.firebase + '/users/' + uid + "/networks");

      self.get("users").getCurrentUser(uid).then(function (currentUser) {
        userRef.set(data[1], onComplete);
      });

    });
  }
});
