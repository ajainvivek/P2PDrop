export default function () {
  let duration = 500;
  this.transition(
    this.fromRoute('home'),
    this.toRoute('about'),
    this.use('fade', {duration: duration/2}),
    this.reverse('fade', {duration: duration/2})
  );
}
