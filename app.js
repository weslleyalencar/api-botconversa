const express = require('express')
const app = express()
const senderBot = require('./api')
const port = process.env.PORT || 3333

app.get('/', function(req, res){
    return res.send({message:'Servidor online'})
})

app.get('/enviar-mensagem', async (req, res) => {
    let {telefone, nome, sobrenome, idflow, chaveapi} = req.query
    try {
        await senderBot.enviarMensagemBotConversa(telefone, nome, sobrenome, idflow, chaveapi)        
        res.send({message: "Mensagem enviada com sucesso para o número " + telefone})
    } catch (error) {
        res.send({message: error.message})
    }    
})

app.use(express.json)

app.listen(port, ()=>{
    console.log("Servidor iniciado na porta " + port)
})


