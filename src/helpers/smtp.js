var sendMail = require('nodemailer');


module.exports = {
    mailHelper: (data) => {
        try {
            var connection = sendMail.createTransport({
                service: 'gmail',
                auth: {
                    user: data[0],
                    pass: data[1]
                }
            });
            
            var options = {
                from: data[0],
                to: data[2],
                subject: data[3],
                text: data[4]
            };
            
            
            connection.sendMail(options, ((error, info)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log(info.response)
                }
            }))
        } catch (e) {
            console.log(e.message)
        }
    }
}