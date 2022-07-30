const fs = require('fs');
var dbfunctions = require("./dbfunctions.js")


export default class emailRepository{

    constructor(jsonPath){
        this.filePath = jsonPath;
    }



    addEmail(email){
        let emails = dbfunctions.dbread(this.filePath);
        emails.push(email);
        dbfunctions.dbwrite(emails);
    }

    getEmails() {
        return dbfunctions.dbread(this.filePath);
        
    }
    
    updateEmail(){

    }

    deleteEmail(email){
        let emails = dbfunctions.dbread(this.filePath);
        emails = emails.filter(e => e !== email); // will return list without input one
        dbfunctions.dbwrite(this.filePath, emails);
    }
}
