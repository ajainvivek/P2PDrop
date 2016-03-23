import Ember from 'ember';
const {
  Mixin,
  inject
} = Ember;

export default Mixin.create({
  notify: inject.service('notify'),
  spinner: inject.service('spinner'),
  authenticateUser(email, password) {
    let self = this;
    this.get('session').authenticate('authenticator:firebase', {
      'email': email,
      'password': password
    }).then( () => {
      self.get('spinner').hide('app-spinner');
      self.transitionToRoute('home');
    }, (error) => {
      self.get('spinner').hide('app-spinner');
      self.get('notify').alert(error.toString());
    });
  }
});
