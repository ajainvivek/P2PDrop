import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  inject
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  setupController: function(controller, model, queryParams) {
  }
});
