import Ember from 'ember';
const {
  Mixin,
  inject
} = Ember;

export default Mixin.create({
  notify: inject.service('notify'),
  authenticateUser(email, password) {
    this.get('session').authenticate('authenticator:firebase', {
      'email': email,
      'password': password
    }).then( () => {
      this.transitionToRoute('home');
    }, (error) => {
      this.get('notify').alert(error.toString());
    });
  }
});
