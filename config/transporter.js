var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env['email'],
        pass: process.env['email_pass']
    }
});

module.exports = transporter;