const nodemailer = require('nodemailer');


const sendEmail = async (to , subject , text)=> {
    const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'muhammadsharief910@gmail.com', 
      pass: 'xsxs enzz dpdn hxqw', 
    },
  });

  const mailOptions = {
    from : 'muhammadsharief910@gmail.com' , 
    to ,
    subject , 
    text,
  }

  await transporter.sendMail(mailOptions);
  
}
module.exports = { sendEmail };
