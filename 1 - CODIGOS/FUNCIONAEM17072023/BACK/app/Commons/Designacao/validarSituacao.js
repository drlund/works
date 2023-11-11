/**
 * Método para validar as possíveis situações da solicitação
 *  EM ANÁLISE:
 *    SUPERADM
 *    DIPES/GEPES
 *    OUTRA UNIDADE
 *  CONCLUIDO
 *  CANCELADO
 *  DE ACORDO PENDENTE
 */
const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const TipoHistorico = use('App/Models/Mysql/Designacao/TipoHistorico');

const validarStatus = require("./validarStatus");
const setDocumento = require("./setDocumento");
const _ = require('lodash');

async function validarSituacao(id, user, novaSituacao, novoStatus) {
  try {

    const solicitacao = await Solicitacao.find(id);

    let novoHistorico;

    solicitacao.id_situacao = novaSituacao;
    if (novaSituacao === 2) {
      solicitacao.encaminhado_para = '9009';
      novoHistorico = 20;
    }

    await solicitacao.save();

    if (novaSituacao === 5) {
      await validarStatus(id, novoStatus);
    }

    let situacoes = await TipoHistorico.find(novoHistorico);

    situacoes = situacoes.toJSON();

    await setDocumento({ id_solicitacao: id, id_historico: 20, texto: ' ', id_negativa: null, tipo: null }, null, user);

    return solicitacao.id

  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = validarSituacao;