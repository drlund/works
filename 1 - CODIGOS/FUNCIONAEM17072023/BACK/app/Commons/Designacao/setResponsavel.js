const setHistorico = require("./setHistorico");
const setDocumento = require("./setDocumento");

const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');

async function setResponsavel(id, user) {
  try {
    let solicitacao = await Solicitacao.find(id);

    solicitacao.responsavel = user.chave;

    await solicitacao.save();

    await setDocumento({ id_solicitacao: id, id_historico: 29 }, null, user);

    return solicitacao.responsavel;
  } catch (err) {
    throw new exception(err, 404)
  }
}

module.exports = setResponsavel;