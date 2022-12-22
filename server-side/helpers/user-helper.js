const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xplore245@gmail.com', // generated ethereal user
        pass: 'fhgttmmruocmawzl', // generated ethereal password
    },
});

module.exports={
    
    OTPgenerator: () => {
        try {
            console.log('OTPgenerator');
            const otpLength = 4
            let otp = ""
            for (let i = 0; i < otpLength; i++) {
                otp += Math.floor(Math.random() * 9)
            }
            return otp
        } catch (error) {
            res.json({
                status: "Failed",
                message: error.message,
            })
        }

    },
    sentOTPverificationmail: (email, otp) => {
        try {
            console.log('sentOTPverificationmail');
            const mailOptions = {
                form: 'xplore245@gmail.com',
                to: email,
                subject: "verify your email",
                html: `<p>Enter <b> ${otp}  </b> in the app to verify your email address</p>`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("errr");
                    console.log(error);
                } else {
                    console.log("Verification otp mail sent");
                    console.log(info.response);
                    res.json({
                        status: "pending",
                        message: "Verification otp mail sent",
                        mail: email,

                    })
                }
            });
        } catch (error) {
            res.json({
                status: "Failed",
                message: error.message,
            })
        }
    }
}