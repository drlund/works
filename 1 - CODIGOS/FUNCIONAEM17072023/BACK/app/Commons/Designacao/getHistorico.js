const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const Historico = use('App/Models/Mysql/Designacao/Historico');
const _ = require('lodash');
const getPerfilFunci = use('App/Commons/Designacao/getPerfilFunci');
const getPerfilFunciSolicitacao = use('App/Commons/Designacao/getPerfilFunciSolicitacao');

async function getHistorico(id, user) {
  try {
    let solicitacao = await Solicitacao.query()
      .where("id", parseInt(id))
      .with("prefixo_dest")
      .with("prefixo_orig")
      .with("analise")
      .first();

    solicitacao = solicitacao.toJSON();

    let perfFunci = await getPerfilFunci(user, id);
    let perfil = await getPerfilFunciSolicitacao(perfFunci.user, solicitacao, perfFunci.funciLogado, perfFunci.comiteAdm, perfFunci.dadosComissaoFunciLogado, perfFunci.funciIsAdmin);

    let historico = await Historico.query()
      .where('id_solicitacao', id)
      .with('tipoHistorico')
      .with('documento')
      .orderBy('id', 'desc')
      .fetch();

    historico = historico.toJSON();

    const tipo = perfil.reduce((prev, curr) => {
      if (['funci_superadm', 'funci_dipes', 'funci_gepes', 'funci_divar', 'funci_dirav'].includes(curr)) {
        return prev += 1;
      }
      return prev;
    }, 0);

    if (tipo === 0) {
      historico = historico.filter((elem) => elem.tipo !== 1);
    }

    historico = historico.map(hist => {
      hist.key = hist.id;
      hist.documento && (hist.documento.documento = JSON.parse(hist.documento.documento));
      return hist;
    })

    return historico;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getHistorico;