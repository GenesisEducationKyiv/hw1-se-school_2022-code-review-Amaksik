var dbfunctions = require("./dbfunctions.js")


class emailRepository{

    constructor(jsonPath){
        this.filePath = jsonPath;
    }



    addEmail(email){
        let emails = dbfunctions.dbread(this.filePath);
        emails.push(email);
        dbfunctions.dbwrite(this.filePath, emails);
    }

    getEmails() {
        return dbfunctions.dbread(this.filePath);
        
    }
    
    updateEmail(){
        //not implemented
    }

    deleteEmail(email){
        let emails = dbfunctions.dbread(this.filePath);
        emails = emails.filter(e => e !== email); // will return list without input one
        dbfunctions.dbwrite(this.filePath, emails);
    }
}

module.exports = emailRepository;
