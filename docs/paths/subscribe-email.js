module.exports = {
    post:{
        tags:['subscription'],
        description: "subscribe to email",
        operationId: "subscribe",
        parameters:[],
        requestBody: {
            content:{
                'application/json': {
                    schema:{
                        $ref:'#/components/schemas/email'
                    }
                }
            }
        },
        responses:{
            '200':{
                description: "Email subscribed"
            },
            '400':{
                description: 'Bad request'
            }
        }
    }
}