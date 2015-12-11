export default function () {
  let duration = 500;
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
      matchBy: 'data-profile-image',
      use: ['fly-to', {duration}]
    })
  );

}
