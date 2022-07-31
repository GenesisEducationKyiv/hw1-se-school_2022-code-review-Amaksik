'use strict';
//config variables
const config = require('config');
const defaultCurrency = config.get('currency');
const apiUrl = config.get('apiUrl');
const nodemailerSettings = config.get('nodemailer');
const filepath = config.get('filelocation');

//packages
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const cors = require('cors');
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer');

//custom modules
const SubscriptionController = require ('./controllers/subscriptionController');
const ratesService = require ('../service/ratesService');
const docs = require('../docs');
const EmailOptions = require('./emailOptions')

//app start
var app = express();

let subscriptionController = new SubscriptionController(filepath);

let port = process.env.PORT || 3000;
let transporter = nodemailer.createTransport(nodemailerSettings);

app.use(
  '/api-docs',
  swaggerUi.serve,
swaggerUi.setup(docs));

app.use(express.json())    // <==== parse request body as JSON
app.use(cors())

//development endpoint for emails verification
app.get('/emails', function(req, res) {
  res = addheaders(res);
  res.send(subscriptionController.getEmails());
});


//required endpoints
app.post('/subscribe', cors(), async function(req, res) {
    let email = req.body.email;
    if(!email){
      res.status(400)
      res.send("email is not provided");
    }
    let validation = await isEmailValid(email);
    if (validation.valid)
    {
        try{
        subscriptionController.subscribeEmail(email)
        res.status(200)
        res.send("E-mail додано");
        }
        catch(e){
            res.status(409)
            res.send('Email is alredy subscribed');
        }
      
    }
    else{
        res.status(400)
      res.send("email not valid");}

    }
);

app.get('/rate', async function(req, res) {
    res = addheaders(res);
    let result;
    if(!req.params.curr1 || !req.params.curr2){
        result = await ratesService.getRates(apiUrl, 'BTC', defaultCurrency);
    }
    else{
        await ratesService.getRates(apiUrl, curr1, defaultCurrency);

    }
    if(result.curr1 && result.curr2 &&result.lprice)
    {
        res.status(200);
        res.send(`Current ${result.curr1} to ${result.curr2} is ${result.lprice}`);
    }
    else{
        res.status(500);
        res.send(`Unfourtunately, Third paty service is unavailable`);
    
    }
    
});

app.post('/sendEmails', cors(), async function(req, res) {
    let emails = subscriptionController.getEmails();
    let rate = (await ratesService.getRates(apiUrl, 'BTC', defaultCurrency)).lprice;
    emails.forEach(element => {

        let mailOptions = new EmailOptions('copimon123@gmail.com', element, "BTC Price Update!", rate);
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
    });
    res.status(200);
    res.send(`All emails sent`);
    
});


app.get('*',function (req, res) {
    res.redirect('/api-docs');
});






app.listen(port, function() {
  console.log(`Example app listening on port http://localhost:${port}`);
});



//dirty fix for cors problem
function addheaders(obj){
  obj.setHeader("Access-Control-Allow-Origin", "*");
  obj.setHeader("Access-Control-Allow-Methods", "*");
  obj.setHeader("Access-Control-Allow-Headers", "*");
  return obj;
}
//module for email validation
async function isEmailValid(email) {
    return emailValidator.validate(email)
  }