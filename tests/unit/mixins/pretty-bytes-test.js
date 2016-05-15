import Ember from 'ember';
import PrettyBytesMixin from '../../../mixins/pretty-bytes';
import { module, test } from 'qunit';

module('Unit | Mixin | pretty bytes');

// Replace this with your real tests.
test('it works', function(assert) {
  var PrettyBytesObject = Ember.Object.extend(PrettyBytesMixin);
  var subject = PrettyBytesObject.create();
  assert.ok(subject);
});
