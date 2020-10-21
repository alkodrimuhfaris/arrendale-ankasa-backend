const sendMail = require('nodemailer');

module.exports = {
    mailHelper: (data) => {
        
        const connection = sendMail.createTransport({
            service: 'gmail',
            auth: {
                user: 'ankasaticketing@gmail.com',
                pass: 'ankasaticketing24'
            }
        });
        
        const options = {
            from: 'ankasaticketing@gmail.com',
            to: data[0],
            subject: 'Password Reset',
            text: data[1]
        };
        
        return new Promise((resolve, reject) => {
            connection.sendMail(options, (error, info)=>{
                if (error) {
                    reject(error)
                } else {
                    resolve(info)
                }
            })
        })
    }
}
