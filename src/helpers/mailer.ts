import User from '@/models/user.model';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
export const sendEmail = async({email,emailType,userId}:any)=>{
    try {
       const hashedToken = await bcryptjs.hash(userId.toString(),10)
        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,
                {$set:
                {verifyToken:hashedToken,
                    verifyTokenExpiry:Date.now()+3600000}})
        }
        else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
               {$set: {forgetPasswordToken:hashedToken,
                    forgetPasswordTokenExpiry:Date.now()+3600000}})
        }
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "02d8bf7a58485e",
      pass: "15850d01dd845a"
    }
  });

        const mailOptions = {
            from: ' hitesh@email.ai',
            to: email,
            subject: emailType==='VERIFY'? "VERIFY YOUR EMAIL":"RESET YOUR PASSWORD",
            html: ` <p> Click <a href ="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"? "verify your email": "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
          }
         const mailresponse=await transport.sendMail(mailOptions)
         return mailresponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}