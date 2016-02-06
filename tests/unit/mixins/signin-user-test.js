import Ember from 'ember';
import SigninUserMixin from '../../../mixins/signin-user';
import { module, test } from 'qunit';

module('Unit | Mixin | signin user');

// Replace this with your real tests.
test('it works', function(assert) {
  var SigninUserObject = Ember.Object.extend(SigninUserMixin);
  var subject = SigninUserObject.create();
  assert.ok(subject);
});
