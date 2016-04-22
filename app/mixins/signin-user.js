import Ember from 'ember';
const {
  Mixin,
  inject
} = Ember;

export default Mixin.create({
  notify: inject.service('notify'),
  spinner: inject.service('spinner'),
  home: inject.controller('home'),
  authenticateUser(email, password, callback) {
    let self = this;
    this.get('session').authenticate('authenticator:firebase', {
      'email': email,
      'password': password
    }).then( () => {
      if (typeof callback === "function") {
        callback(function (guid) {
          self.get('spinner').hide('app-spinner');
          self.transitionToRoute('home');
          self.get('home').setVerification(guid);
        });
      } else {
        self.get('spinner').hide('app-spinner');
        self.transitionToRoute('home');
      }

    }, (error) => {
      self.get('spinner').hide('app-spinner');
      self.get('notify').alert(error.toString());
    });
  }
});
