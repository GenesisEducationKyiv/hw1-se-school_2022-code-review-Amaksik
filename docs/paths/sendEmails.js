module.exports = {
    post:{
        tags:['subscription'],
        description: "send emails",
        operationId: "sendEmails",
        parameters:[],
        requestBody: {},
        responses:{
            '200':{
                description: "Emails have been sent"
            }
        }
    }
}