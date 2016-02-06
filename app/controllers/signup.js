import Ember from 'ember';
import config from '../config/environment';
import LoginUser from '../mixins/signin-user';
const { Controller } = Ember;

export default Controller.extend(
  LoginUser, {

    userValues(){
      return {
        email: this.get('email'),
        password: this.get('password'),
        passwordConfirmation: this.get('passwordConfirmation')
      };
    },

    actions: {
      signup(){
        if (this.get('name') === undefined) { return; }
        const firebase = new Firebase(config.firebase);
        firebase.createUser(this.userValues(), (error, userData) => {
            if (error) {
              //Handle Errors here.
            } else {
              this.store.createRecord('user', {
              id: userData.uid,
              name: this.get('name')
            }).save();
          this.authenticateUser(this.get('email'), this.get('password'));
        }
        });
      }
    }
  }
);
