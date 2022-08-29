const EmailRepository = require( "../integration/emailRepository");

class emailService{

    constructor(jsonPath){
        this.emailRepository = new EmailRepository(jsonPath);
    }

    subscribeEmail(email){
        let savedEmails = this.emailRepository.getEmails();
        if (savedEmails.indexOf(email) === -1) {
            this.emailRepository.addEmail(email);
        } 
        else{
            throw new Error(`email ${email} already exists`);
        }

    }
    unsubscribeEmail(email){
        let savedEmails = this.emailRepository.getEmails();
        if (savedEmails.indexOf(email) !== -1) {
            this.emailRepository.deleteEmail(email);
        } 
        else{
            throw new Error("user not exists");
        }

    }

    getAll(){
        return this.emailRepository.getEmails();
    }
}

module.exports = emailService;