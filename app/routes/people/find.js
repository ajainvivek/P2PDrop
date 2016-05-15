import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  inject
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  users : inject.service("users"),
  setupController: function(controller, model, queryParams) {
    controller.fetchUsers();
  }
});
