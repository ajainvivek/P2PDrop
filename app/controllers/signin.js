import Ember from 'ember';
import LoginUser from '../mixins/signin-user';
const {
  Controller,
  inject
} = Ember;

export default Controller.extend(
  LoginUser, {
    spinner: inject.service("spinner"),
    emailValidation: {
      'errorMessage': 'Please provide email in a valid format',
      'isError': (inputValue) => {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return !emailPattern.test(inputValue);
      }
    },
    actions: {
      signin(e) {
        e.preventDefault();
        this.get('spinner').show('app-spinner');
        this.authenticateUser(this.get('email'), this.get('password'));
      },
      goToSignUp() {
        this.transitionToRoute("signup");
      }
     }
  });
