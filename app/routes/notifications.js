import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController: function (controller, model, queryParams) {
    controller.getPendingApprovals().then(function (data) {
      controller.set("pendingApprovals", data);
    });
  }
});
