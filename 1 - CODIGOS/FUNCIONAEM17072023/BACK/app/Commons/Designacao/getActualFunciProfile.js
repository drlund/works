const _ = use('lodash');
const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const getPerfilFunci = use('App/Commons/Designacao/getPerfilFunci');
const getPerfilFunciSolicitacao = use('App/Commons/Designacao/getPerfilFunciSolicitacao');
const {ANALISE} = use('App/Commons/Designacao/Constants')

async function getActualFunciProfile(solicitacao, user) {

  try {
    let perfFunci = await getPerfilFunci(user, solicitacao.id);
    let perfil = await getPerfilFunciSolicitacao(perfFunci.user, solicitacao, perfFunci.funciLogado, perfFunci.comiteAdm, perfFunci.dadosComissaoFunciLogado, perfFunci.funciIsAdmin);

    let perfis = [];

    for (let i = 0; i < perfil.length; i++) {
      if (ANALISE[perfil[i]]) {
        perfis.push({ perfil: perfil[i], assinado: solicitacao.analise[ANALISE[perfil[i]]] || 0 })
      }
      if (perfil[i] === 'comite_diretoria') {
        perfis.push({ perfil: perfil[i], assinado: solicitacao.analise[ANALISE.funci_divar || ANALISE.funci_dirav] })
      }
    }

    return perfis;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getActualFunciProfile;