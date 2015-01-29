var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , nodemailer = require('nodemailer')
  ;

var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || config.EMAIL_HOST,
    port: process.env.EMAIL_PORT || config.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL || config.EMAIL,
        pass: process.env.EMAIL_PASS || config.EMAIL_PASS
    }
});

module.exports = transporter;