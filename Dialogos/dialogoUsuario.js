const { MessageFactory } = require('botbuilder')
const { channels } = require('botbuilder-dialogs/lib/choices/channel');
const {AttachmentPrompt,ChoiceFactory,ChoicePrompt,ComponentDialog,ConfirmPrompt,DialogSet,DialogTurnStatus,NumberPrompt,TextPrompt,WaterfallDialog } = require('botbuilder-dialogs')
const { perfilUsuario } = require('../perfilUsuario')

const  ATTACHMENT_PROMPT  =  'ATTACHMENT_PROMPT' 
const  CHOICE_PROMPT  =  'CHOICE_PROMPT' 
const  CONFIRM_PROMPT  =  'CONFIRM_PROMPT' 
const  NAME_PROMPT  =  'NAME_PROMPT' 
const  NUMBER_PROMPT  =  'NUMBER_PROMPT' 
const  USER_PROFILE  =  'USER_PROFILE' 
const  WATERFALL_DIALOG  =  'WATERFALL_DIALOG' 

class dialogoUsuario extends ComponentDialog {
  constructor(userState) {
    super('dialogoUsuario')
    
    this.perfilUsuario = userState.createProperty(USER_PROFILE)
    this.addDialog(new TextPrompt(NAME_PROMPT))
    this.addDialog(new ChoicePrompt(CHOICE_PROMPT))
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
    this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.cpfPromptValidador))
    this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT))
    this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
      this.inicioStep.bind(this),
      this.nomeStep.bind(this),
      this.nomeConfirmStep.bind(this),
      this.idadeStep.bind(this),
      /* this.cpfStep.bind(this),
       this.cpfConfirmStep.bind(this),
       this.pictureStep.bind(this),
       this.confirmStep.bind(this),
       this.summaryStep.bind(this)*/


    ]))
    this.initialDialogId = WATERFALL_DIALOG
  }
  //O método run lida com a atividade recebida (na forma de um TurnContext) e a passa pelo sistema de diálogo ... se nao estiver escrito nda ele começa o dialogo padrão

  async run(turnContext, acessor) {
    const corpoDialogo = new DialogSet(acessor)
    corpoDialogo.add(this)
    const contextoDialogo = await corpoDialogo.createContext(turnContext)
    const resutado = await contextoDialogo.continueDialog()
    if (resutado.status === DialogTurnStatus.empty) {
      await contextoDialogo.beginDialog(this.id)
    }
  }

  /// aki e o começo da cascata
  
  async inicioStep(step) {
    return await step.prompt(CHOICE_PROMPT, {
      prompt: 'Olá bem vindo, esta é a sua primeira visita ?',
      choices: ChoiceFactory.toChoices(['Sim', 'Não'])
    })
  }
  async nomeStep(step) {
    step.values.inicio = step.result.value
    return await step.prompt(NAME_PROMPT, 'Porfavor digite o seu nome')
  }
  async nomeConfirmStep(step) {
    step.values.nome = step.result
    await step.context.sendActivity(`Obrigado ${step.result} .`)
    return await step.prompt(CONFIRM_PROMPT, 'Voce possui maior de 18 anos ?', ['Sim', 'Não'])
  }
  async idadeStep(step) {
    step.values.idade = step.result
    const checkIdade = step.result
    console.log(checkIdade)
    if (checkIdade === true) {
     await step.context.sendActivity('tudo certo!') 
    } else {
      await step.context.sendActivity('Somente maiores de idade podera permanecer neste site')
    }
    return await step.context.sendActivity('cascata tudo certo ate aki')
  }

}
module.exports.dialogoUsuario = dialogoUsuario