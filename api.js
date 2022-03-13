const axios = require("axios")
const { json } = require("express/lib/response")
require('dotenv').config()
var API_KEY = ''


async function enviarMensagemBotConversa(telefone, nome = '', sobrenome = '', idFlowBotConversa, chaveapi) {
  try {
    setApiToken(chaveapi)
    await cadastrarUsuario(telefone, nome, sobrenome)    
    let idContatoBotConversa = await buscarIDUsuarioPorTelefone(telefone)
    await enviarMensagemFlow(idContatoBotConversa, idFlowBotConversa)
    
  } catch (error) {
    throw new UserException(error.message);
  }


}

async function cadastrarUsuario(telefone, nome, sobrenome) {
  let data = JSON.stringify({
    "phone": "+55" + telefone,
    "first_name": nome,
    "last_name": sobrenome
  });

  var config = {
    method: 'post',
    url: 'https://backend.botconversa.com.br/api/v1/webhook/subscriber/',
    headers: {
      'API-KEY': API_KEY,
      'Content-Type': 'application/json'
    },
    data: data
  };


  axios(config)
    .then(function (response) {
      console.log('Usuário cadatrado com sucesso!');
    })
    .catch(function (error) {
      throw new UserException('Não foi possível cadastrar o usuário');
    });
}

async function buscarIDUsuarioPorTelefone(telefone) {
  let idContato
  let url = `https://backend.botconversa.com.br/api/v1/webhook/subscriber/${telefone}/`
  let config = {
    method: 'get',
    url: url,
    headers: {
      'API-KEY': API_KEY
    }
  };

  await axios(config)
    .then(function (response) {
      idContato = response.data.id;
    })
    .catch(function (error) {
      throw new UserException('Não foi possível localizar o usuário pelo telefone');
    });

  return idContato
}

async function enviarMensagemFlow(idContatoBotConversa, idFlowBotConversa) {
  var data = JSON.stringify({
    "flow": idFlowBotConversa
  });

  var config = {
    method: 'post',
    url: `https://backend.botconversa.com.br/api/v1/webhook/subscriber/${idContatoBotConversa}/send_flow/`,
    headers: {
      'API-KEY': API_KEY,
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      throw new UserException('Não foi possível enviar a mensagem');
    });
}

function setApiToken(chaveapi) {
  let dados = eval(process.env.APIKEY)
  let api = dados.filter(o => o.name == chaveapi)[0]

  if (api == "" || api == undefined) {
    throw new UserException("Chave API Inválida!");
  } else {
    console.log("## LOGADO ##")
    console.log(api.empresa)
    console.log("#############")
    API_KEY = api.value
  }
}

function UserException(message) {
  this.message = message;
  this.name = "UserException";
}


module.exports.enviarMensagemBotConversa = enviarMensagemBotConversa