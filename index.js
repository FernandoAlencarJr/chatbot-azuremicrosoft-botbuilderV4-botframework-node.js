require('dotenv-extended').load({
    path: './.env'
})

const restify = require('restify')
const { BotFrameworkAdapter } = require('botbuilder')
const { EmptyBot } = require('./bot')

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} escutando ${server.url}`)
  console.log('FernandoAlencarJr')
  console.log('Não se esqueça de baixar o botFrameworkV4')
  console.log('Siga minha página no GitHub !')
})

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

const myBot = new EmptyBot()

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context)
    })
})
