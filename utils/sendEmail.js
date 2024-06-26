const nodemailer = require('nodemailer')

const sendEmail = async (subject, message, send_to, sent_from, reply_to) =>{
 const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
 })
// options for sending
 const option = {
    from: sent_from,
    html: message,
    to: send_to,
    replyTo: reply_to,
    subject, subject
 }


// send email
transporter.sendMail(option, function(err, info){
    if(err){
        console.log("Mail Error:",err)
    }else{
        console.log("Mail info:",info)
    }

 })}
module.exports = sendEmail;

