import Ember from 'ember';
import config from '../config/environment';

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  users: inject.service('users'),
  spinner: inject.service('spinner'),
  notify: inject.service('notify'),
  isNotVerified : false,
  verificationCode : null,
  code: null,
  init : function () {
    this.setVerification();
  },
  setVerification: function (guid) {
    const uid = this.get('session.secure.uid');
    let self = this;
    this.get("users").getCurrentUser(uid).then(function (currentUser) {
      self.set("isNotVerified", !currentUser.isVerified);
      self.set("verificationCode", currentUser.verificationCode || guid);
    });
  },
  actions: {
    verify(e) {
      e.preventDefault();
      const uid = this.get('session.secure.uid');
      let self = this;
      let isVerifiedRef = new Firebase(config.firebase + '/users/' + uid + '/isVerified');
      let verificationCode = this.get('verificationCode');
      let code = this.get('code');

      if (verificationCode && (verificationCode === code)) {
        isVerifiedRef.set(true, function (error) {
          if (error) {
            console.log('Synchronization failed');
          } else {
            self.set("isNotVerified", false);
            console.log('Synchronization succeeded');
          }
        });
      }
    },
    resend() {
      const uid = this.get('session.secure.uid');
      let self = this;
      self.get('spinner').show('app-spinner');
      this.get("users").sendVerificationCode(uid).then(function (data) {
        if (data.status === "success") {
          self.get('notify').info("Verification mail sent!");
        } else {
          self.get('notify').info("Verification mail not sent!");
        }
        self.get('spinner').hide('app-spinner');
      }, function () {
        self.get('notify').info("Verification mail not sent!");
        self.get('spinner').hide('app-spinner');
      });
    }
  }
});
