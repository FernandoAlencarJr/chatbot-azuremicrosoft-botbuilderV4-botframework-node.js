require('dotenv-extended').load({
    path: './.env'
})

const restify = require('restify')
const { BotFrameworkAdapter,ConversationState,MemoryStorage,UserState } = require('botbuilder')
const { EmptyBot } = require('./bot')
const { dialogoUsuario } = require('./Dialogos/dialogoUsuario')





const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID,
    appPassword: process.env.MicrosoftAppPassword
})

adapter.onTurnError = async (context, error) => {
    console.error(`\n error : ${ error }`)
    await context.sendTraceActivity(
        'error ativo',
        `${ error }`,
    )
    await context.sendActivity('está com algum erro ')
    await context.sendActivity('para o bot continuar funcionando arrume este erro.')
}

const memoryStorage = new MemoryStorage()

const conversationState = new ConversationState(memoryStorage)
const userState = new UserState(memoryStorage)
const dialogo = new dialogoUsuario(userState)
const myBot = new EmptyBot(conversationState, userState, dialogo)

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} escutando ${server.url}`)
  console.log('FernandoAlencarJr')
  console.log('Não se esqueça de baixar o botFrameworkV4')
  console.log('Siga minha página no GitHub !')
})

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context)
    })
})
