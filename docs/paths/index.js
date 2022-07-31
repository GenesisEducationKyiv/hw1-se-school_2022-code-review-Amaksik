const subscribe = require('./subscribe-email');
const sendEmails = require('./sendEmails');
const getRate = require('./getRate');



module.exports = {
    paths:{
        '/rate':{
            ...getRate
        },
        '/subscribe':{
            ...subscribe
        },
        '/sendEmails':{
            ...sendEmails
        }
    }
}