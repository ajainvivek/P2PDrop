export default function () {
  let duration = 500;

  this.transition(
    this.fromRoute('signin'),
    this.toRoute('signup'),
    this.use('toLeft', {duration: duration/2}),
    this.reverse('toRight', {duration: duration/2})
  );

  this.transition(
    this.fromRoute('home'),
    this.toRoute('about'),
    this.use('fade', {duration: duration/2}),
    this.reverse('fade', {duration: duration/2})
  );

  this.transition(
    this.fromRoute('home'),
    this.toRoute('people'),
    this.use('fade', {duration: duration/2}),
    this.reverse('fade', {duration: duration/2})
  );

  this.transition(
    this.fromRoute('people'),
    this.toRoute('about'),
    this.use('fade', {duration: duration/2}),
    this.reverse('fade', {duration: duration/2})
  );

  this.transition(
    this.fromRoute('people.find'),
    this.toRoute('people.detail'),
    this.useAndReverse('explode', {
      matchBy: 'data-profile-email',
      use: ['fly-to', {duration}]
    },{
      use: "fade"
    })
  );

  this.transition(
    this.hasClass('action-bar'),
    this.toValue(true),
    this.use('toUp', {duration}),
    this.reverse('toDown', {duration})
  );

  this.transition(
    this.hasClass('slide'),
    this.toValue(true),
    this.use('toLeft', {duration}),
    this.reverse('toRight', {duration})
  );

}
