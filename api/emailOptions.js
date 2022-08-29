class EmailOptions{
  constructor(sender, receiver, subject, currentrate) {
    this.from = sender;
    this.to = receiver;
    this.subject = subject;
    this.text = `Hi there,\nThe current rate of currency is ${currentrate}\nThanks for using our service!)`;
  };
}
module.exports = EmailOptions;
  