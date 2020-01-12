const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SendGRID_API_KEY)
const sendJoiningMail=(email,name)=>{
      sgMail.send({
        to: email,
        from: 'saby537@gmail.com',
        subject: 'Thank You for joining',
        text: `${name} and easy to do anywhere, even with Node.js`,
        html:`<strong> ${name} and easy to do anywhere, even with Node.js</strong>`
      })      
}
const sendCancellingMail=(email,name)=>{
      sgMail.send({
        to: email,
        from: 'saby537@gmail.com',
        subject: 'Great having you',
        text: `${name} and easy to do anywhere, even with Node.js`
      })
}
module.exports={
    sendJoiningMail,
    sendCancellingMail
}
