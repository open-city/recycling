var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mybuildingdoesntrecycle@gmail.com',
        pass: process.env['email_pass'] || ''
    }
});

module.exports = transporter;