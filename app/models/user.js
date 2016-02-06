import DS from 'ember-data';
const {
  attr,
  hasMany,
  Model
  } = DS;

export default Model.extend({
  avatar: attr('string'),
  name:   attr('string'),
  online: attr('string')
});
