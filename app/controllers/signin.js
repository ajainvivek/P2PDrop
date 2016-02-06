import Ember from 'ember';
import LoginUser from '../mixins/signin-user';
const {
  Controller
  } = Ember;

export default Controller.extend(
  LoginUser, {
    actions: {
      signin() {
        this.authenticateUser(this.get('email'), this.get('password'));
      }
    }
  });
