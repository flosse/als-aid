const stripe = require("stripe")("sk_test_auxnQ0jujI9zMQJbEn6l5HA9");

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:


exports.getDonate = (req, res) => {
  res.render('donate', {
    title: 'Donate'
  });
};


exports.stripeCharge = (req, res) => {
  //debugger;
  var token = req.body.stripeToken; // Using Express
  var amount = 100 * req.body.amount;
  var chargeObj = stripe.charges.create({
  amount: amount,
  currency: "usd",
  description: "My test example charge",
  source: token,
    }, function(err, charge) {
    // asynchronously called
    //debugger;
  });

}
