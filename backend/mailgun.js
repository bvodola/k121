const API_URL = 'mirovoy.com.br';
const API_KEY = process.env.MAILGUN_API_KEY;
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: API_URL});

// send()
// Envia email com Mailgun
const send = function(data, cb = function() {}) {
  mailgun.messages().send(data, function (err, body) {
    cb(err,body);
  });
}

module.exports = { send };
