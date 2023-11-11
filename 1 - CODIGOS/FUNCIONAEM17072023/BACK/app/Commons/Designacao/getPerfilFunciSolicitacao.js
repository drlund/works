"use strict"

const {getOneFunci} = use("App/Commons/Arh");
const getComitesAdmByMatricula = use("App/Commons/Arh/getComitesAdmByMatricula");

const _ = use('lodash');
const exception = use('App/Exceptions/Handler');
const { getDadosComissaoCompleto } = use('App/Commons/Arh');
const getPrefixoMadrinha = use("App/Commons/Designacao/getPrefixoMadrinha");
const Constants = use("App/Commons/Designacao/Constants");

async function getPerfilFunciSolicitacao(user, solicitacao, funciLog = null, comiteAdm = null, nivelGer = null, admin = null) {

  const PERFIL = Constants.PERFIL;
  try {
    _.isNil(funciLog) && (funciLog = await getOneFunci(user.chave));
    _.isNil(comiteAdm) && (comiteAdm = await getComitesAdmByMatricula(user.chave));
    _.isNil(nivelGer) && (nivelGer = await getDadosComissaoCompleto(user.cod_funcao));
    _.isNil(admin) && (admin = !!nivelGer.flag_administrador);

    let perfil = [];

    // ? Prefixos Gestores
    const prefixosGestores = [Constants.PREFIXO_SUPERADM, Constants.PREFIXO_DIPES, Constants.PREFIXO_GEPES, Constants.PREFIXO_DIVAR, Constants.PREFIXO_DIRAV];

    const getLocalPerfil = {
      [Constants.PREFIXO_SUPERADM]: PERFIL.FUNCI_SUPERADM,
      [Constants.PREFIXO_DIPES]: PERFIL.FUNCI_DIPES,
      [Constants.PREFIXO_GEPES]: PERFIL.FUNCI_GEPES,
      [Constants.PREFIXO_DIVAR]: PERFIL.FUNCI_DIVAR,
      [Constants.PREFIXO_DIRAV]: PERFIL.FUNCI_DIRAV
    };

    if (prefixosGestores.includes(user.prefixo)) perfil.push(getLocalPerfil[user.prefixo]);

    const isMadrinhaOrig = await getPrefixoMadrinha(solicitacao.pref_orig);
    const isMadrinhaDest = await getPrefixoMadrinha(solicitacao.pref_dest);

    // ? Prefixos Intervenientes
    if (funciLog.agenciaLocalizacao === solicitacao.pref_orig || funciLog.ag_localiz === solicitacao.pref_orig) {
      perfil.push(PERFIL.FUNCI_ORIG);
      (admin && solicitacao.prefixo_orig.tip_dep !== 15) && perfil.push(PERFIL.GG_ORIG);
      (!admin && comiteAdm.PREFIXO === parseInt(solicitacao.pref_orig)) && perfil.push(PERFIL.COMITE_ORIG);
    }

    if (funciLog.agenciaLocalizacao === solicitacao.pref_dest || funciLog.ag_localiz === solicitacao.pref_dest) {
      perfil.push(PERFIL.FUNCI_DEST);
      (admin && solicitacao.prefixo_dest.tip_dep !== 15) && perfil.push(PERFIL.GG_DEST);
      (!admin && comiteAdm.PREFIXO === parseInt(solicitacao.pref_dest)) && perfil.push(PERFIL.COMITE_DEST);
    }

    if (!!isMadrinhaOrig && (isMadrinhaOrig.prefixo === funciLog.agenciaLocalizacao || isMadrinhaOrig.prefixo === funciLog.ag_localiz)) {
      perfil.push(PERFIL.FUNCI_ORIG);
      admin && perfil.push(PERFIL.GG_ORIG);
    }

    if (!!isMadrinhaDest && (isMadrinhaDest.prefixo === funciLog.agenciaLocalizacao || isMadrinhaDest.prefixo === funciLog.ag_localiz)) {
      perfil.push(PERFIL.FUNCI_DEST);
      admin && perfil.push(PERFIL.GG_DEST);
    }

    if (user.prefixo === solicitacao.prefixo_dest.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_DEST);

      // ? Se Super Estadual
      if (nivelGer.ref_org === '1GUT') {
        perfil.push(PERFIL.SUPER_ESTADUAL_DESTINO);
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_dest.gerev === user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_DEST);

        if (nivelGer.ref_org === '2GUT' && admin) {
          perfil.push(PERFIL.SUPER_REGIONAL_DESTINO);
        }
      }
      if (!_.isEmpty(comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_DESTINO);
      }

    }

    if (user.prefixo === solicitacao.prefixo_orig.cd_super_juris) {

      perfil.push(PERFIL.FUNCI_SUPER_ORIG);

      // ? Se Super Estadual
      if (nivelGer.ref_org === '1GUT') {
        perfil.push(PERFIL.SUPER_ESTADUAL_ORIGEM);
      }
      // ? Se Super Regional
      if (solicitacao.prefixo_orig.gerev === user.pref_regional) {
        perfil.push(PERFIL.FUNCI_GEREV_ORIG);

        if (nivelGer.ref_org === '2GUT' && admin) {
          perfil.push(PERFIL.SUPER_REGIONAL_ORIGEM);
        }
      }
      if (!_.isEmpty(comiteAdm)) {
        perfil.push(PERFIL.COMITE_SUPER_ORIGEM);
      }

    }

    if (perfil.includes(PERFIL.FUNCI_DIVAR) || perfil.includes(PERFIL.FUNCI_DIRAV)) {
      if (!_.isEmpty(comiteAdm)) perfil.push(PERFIL.COMITE_DIRETORIA);
    }

    return perfil;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getPerfilFunciSolicitacao;