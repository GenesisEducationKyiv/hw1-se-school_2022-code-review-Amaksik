const EmailService = require("../../service/emailsService");

class subscriptionController{
    constructor(filepath){
        this.emailService = new EmailService(filepath);
    }


getEmails = () =>{
    return this.emailService.getAll();
}
subscribeEmail(email){
    
    this.emailService.subscribeEmail(email);
    
}

}

module.exports = subscriptionController;