const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const Analise = use('App/Models/Mysql/Designacao/Analise');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const {isPrefixoUN} = use('App/Commons/Arh');
const Constants = use('App/Commons/Designacao/Constants');

const PERFIL = Constants.PERFIL;

async function getPerfilAnalise(id_solicitacao) {

  try {
    let solicitacao = await Solicitacao.find(id_solicitacao);

    solicitacao = solicitacao.toJSON();

    let analise = await Analise.findBy('id_solicitacao', id_solicitacao);

    analise = analise.toJSON();

    let perfis = [PERFIL.GG_ORIG, PERFIL.COMITE_ORIG, PERFIL.GG_DEST, PERFIL.COMITE_DEST];

    // origem e destino mesmo prefixo e UN
    if (await isPrefixoUN(solicitacao.pref_dest)) {
      /**
       * aceita-se gg_orig, gg_dest e super estadual, regional e comite assinando como todos;
       */

      if (solicitacao.gg_ou_super || analise.deacordo_super_destino || solicitacao.limitrofes) {
        perfis.push(PERFIL.SUPER_REGIONAL_DESTINO);
        perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        perfis.push(PERFIL.COMITE_SUPER_DESTINO);

        perfis.push(PERFIL.SUPER_REGIONAL_ORIGEM);
        perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
        perfis.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

    } else {

      if (solicitacao.gg_ou_super) {
        perfis.push(PERFIL.SUPER_ESTADUAL_DESTINO);
        perfis.push(PERFIL.COMITE_SUPER_DESTINO);

        perfis.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
        perfis.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

      if (solicitacao.super) {
        perfis.push(PERFIL.COMITE_DIRETORIA);
      }
    }

    return perfis;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getPerfilAnalise;