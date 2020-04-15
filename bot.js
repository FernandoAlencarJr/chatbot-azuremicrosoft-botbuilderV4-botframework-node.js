require('dotenv-extended').load({
    path:'/.env'
})
const { ActivityHandler } = require('botbuilder')
const { LuisRecognizer } = require('botbuilder-ai')

class EmptyBot extends ActivityHandler {
    constructor() {
        super();
        var reconhecer = new LuisRecognizer( {
            applicationId= process.env.LuisAppId,
            endpointKey= process.env.LuisAPIKey,
            endpoint= `https://${ process.env.LuisAPIHostName }.api.cognitive.microsoft.com/luis/api/v2.0`
        }, {
                includeAllIntents= true,
                includeInstanceData= true
            
        }, true)
        this.reconhecer = reconhecer
        reconhecer.logPersonalInformation = true
        
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Bem Vindo !')
                }
            }
            await next()
        })
        this.onTurnActivity(async (context, next) => {
            const reconhecerResutado = await reconhecer.recognize(context)
            const intencao = LuisRecognizer.topIntent(reconhecerResutado)
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult)
            await next()
        })








    }
}
module.exports.EmptyBot = EmptyBot;
