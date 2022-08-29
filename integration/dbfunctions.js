const fs = require('fs');

module.exports.dbread = (filepath) =>{
    return JSON.parse(fs.readFileSync(filepath));
};

module.exports.dbwrite = (filepath, inputdata) =>{
    fs.writeFileSync(filepath, JSON.stringify(inputdata));
};