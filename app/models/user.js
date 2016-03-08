import DS from 'ember-data';
const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend({
  profilePic: attr(),
  name:   attr('string'),
  online: attr('string'),
  gender: attr('string'),
  email: attr('string'),
  friends: attr()
});
