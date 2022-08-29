module.exports = {
    get:{
        tags:['rate'],
        description: "Get BTC rate",
        operationId: "rate",
        parameters:[],
        responses:{
            '200':{
                description:"Ok",
            },
            '500':{
                description: "Third party service is unavailable",
            }
        }
    }
}