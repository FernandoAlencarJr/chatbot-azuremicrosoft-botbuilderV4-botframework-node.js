require('dotenv-extended').load({
    path:'/.env'
})
const { ActivityHandler } = require('botbuilder')
const { LuisRecognizer } = require('botbuilder-ai')

class EmptyBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
      super();

      this.conversationState = conversationState;
      this.userState = userState;
      this.dialog = dialog;
      this.dialogState = this.conversationState.createProperty('DialogState');
      this.onMessage(async (context, next) => {
        console.log('executando o diálogo');

        await this.dialog.run(context, this.dialogState);

        await next();
    });

        var reconhecer = new LuisRecognizer( {
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${ process.env.LuisAPIHostName }.api.cognitive.microsoft.com/luis/api/v2.0`
        }, {
                includeAllIntents: true,
                includeInstanceData: true
            
        }, true)
        this.reconhecer = reconhecer
           
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Bem Vindo!')
                }
            }
            await next()
        })
  }
  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
}
}
module.exports.EmptyBot = EmptyBot;
