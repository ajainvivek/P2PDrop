import Ember from "ember";

const {
  Controller,
  inject
} = Ember;

export default Controller.extend({
  users : {},
  traverseBack : function () {
    this.transitionToRoute("people.find");
  }
});
