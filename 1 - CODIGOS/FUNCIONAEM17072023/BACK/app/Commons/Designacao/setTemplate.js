const exception = use('App/Exceptions/Handler');
const Template = use('App/Models/Mysql/Designacao/Template');
/** @type {typeof import('moment')} */
const moment = require("moment");

require("moment/locale/pt-br");

async function setTemplate(dados) {
  try {

    let novoTemplate;

    if (dados.id) {
      novoTemplate = await Template.find(dados.id);

      dados.excluir && (novoTemplate.valido = 0);
      novoTemplate.funci_alteracao = dados.user.chave;
      novoTemplate.data_alteracao = moment().format("YYYY-MM-DD HH:mm:ss");
    } else {
      novoTemplate = new Template();

      novoTemplate.funci_criacao = dados.user.chave;
      novoTemplate.data_criacao = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    dados.id_tipo_historico && (novoTemplate.id_tipo_historico = dados.id_tipo_historico);
    dados.curto && (novoTemplate.curto = dados.curto);
    dados.texto && (novoTemplate.texto = dados.texto);

    await novoTemplate.save();

    return novoTemplate;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = setTemplate;