const _ = require('lodash');
const moment = require('moment');

const exception = use('App/Exceptions/Handler');

const { executeDB2Query } = use('App/Models/DB2/DB2Utils');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const MestreSas = use('App/Models/Mysql/MestreSas');

const { isAdmin, getOneDependencia, getDadosComissaoCompleto } = use('App/Commons/Arh');
const Funci = use('App/Models/Mysql/Arh/Funci');
const Prefixo = use('App/Models/Mysql/Arh/Prefixo');
const Superadm = use('App/Models/Mysql/Superadm');
const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const getPrefixoMadrinha = use("App/Commons/Designacao/getPrefixoMadrinha");
const Constants = use('App/Commons/Designacao/Constants')

const { getListaComitesByMatricula } = use(
  "App/Commons/Arh/dadosComites"
);

async function getDadosFunciOnline(user) {
  try {

    let funci = await Funci.query()
      .where("matricula", user.chave)
      .first();

    const userBaseSubstituicoes = await MestreSas.query()
      .select('comissaoDestino', 'prefixoDestino')
      .from('BaseSubstituicoes')
      .where('matricula', user.chave)
      .where('dataSubstituicao', moment().startOf().format(Constants.DATABASE_DATE_INPUT))
      .fetch();

    const dadosUserBaseSubstituicoes = userBaseSubstituicoes.toJSON();

    // const queryUserDB2 = `
    //   SELECT *
    //   FROM DB2ATC.USU_VW t1
    //   WHERE t1.CD_USU = '${user.chave}';
    // `;

    // let userDB2 = await executeDB2Query(queryUserDB2.replace(/\n/g, '').trim(), []);

    let userSubstituto = null;

    if (!_.isNil(dadosUserBaseSubstituicoes) && !_.isEmpty(dadosUserBaseSubstituicoes)) {
      userSubstituto = _.head(dadosUserBaseSubstituicoes);
    }

    let funciLogado = funci.toJSON();

    /**
     * Fazer aqui as comparações entre os dados do user, funciLogado e userDB2
     */

    // let dadosUserBaseSubstituicoes = user.cod_funcao === userDB2.CD_CMSS_USU && parseInt(funciLogado.comissao) === userDB2.CD_CMSS_USU;
    // let prefixo = parseInt(user.prefixo) === userDB2.CD_PRF_DEPE_ATU && parseInt(funciLogado.ag_localiz) === userDB2.CD_PRF_DEPE_ATU;

    let dadosComissaoFunciLogado;

    if (userSubstituto) {
      const isMesmaComissao = userSubstituto.comissaoDestino && user.cod_funcao === userSubstituto.comissaoDestino && parseInt(funciLogado.comissao) === userSubstituto.comissaoDestino;
      const isMesmoPrefixo = userSubstituto.prefixoDestino && parseInt(user.prefixo) === userSubstituto.prefixoDestino && parseInt(funciLogado.ag_localiz) === userSubstituto.prefixoDestino;

      const comissaoDestino = userSubstituto.comissaoDestino;
      const prefixoDestino = userSubstituto.prefixoDestino;

      dadosComissaoFunciLogado = await getDadosComissaoCompleto(user.cod_funcao);

      if (!isMesmaComissao) {
        user.cod_funcao = comissaoDestino;
        funciLogado.comissao = String(comissaoDestino);

        funciLogado = {
          ...funciLogado,
          comissao: String(comissaoDestino),
          desc_cargo: dadosComissaoFunciLogado.nome_funcao,
          carga_horaria: dadosComissaoFunciLogado.jornada
        };

        user = {
          ...user,
          cod_funcao: comissaoDestino,
          nome_funcao: dadosComissaoFunciLogado.nome_funcao,
        };

      }

      if (!isMesmoPrefixo) {
        user.prefixo = funciLogado.ag_localiz = String(prefixoDestino);

        const prefixoAtual = await Prefixo.query()
          .with("dadosDiretoria", (query) => {
            query.sb00()
          })
          .with("dadosSuper", (query) => {
            query.sb00()
          })
          .with("dadosGerev", (query) => {
            query.sb00()
          })
          .where("prefixo", user.prefixo)
          .sb00()
          .first();

        const dadosPrefixoAtual = prefixoAtual.toJSON();

        funciLogado = {
          ...funciLogado,
          ag_localiz: String(prefixoDestino),
          comissao: String(comissaoDestino),
          cod_uor_localizacao: dadosPrefixoAtual.uor_dependencia,
          desc_localizacao: dadosPrefixoAtual.nome,
          uor_trabalho: dadosPrefixoAtual.uor_dependencia,
          nome_uor_localizacao: dadosPrefixoAtual.nome,
          cod_uor_trabalho: dadosPrefixoAtual.uor_dependencia,
          nome_uor_trabalho: dadosPrefixoAtual.nome,
          cod_uor_grupo: dadosPrefixoAtual.uor_dependencia,
          nome_uor_grupo: dadosPrefixoAtual.nome,
          cod_uor_localizacao2: dadosPrefixoAtual.uor_dependencia
        };

        user = {
          ...user,
          prefixo: String(prefixoDestino),
          dependencia: dadosPrefixoAtual.nome,
          nome_regional: dadosPrefixoAtual.dadosGerev.nome,
          nome_super: dadosPrefixoAtual.dadosSuper.nome,
          pref_diretoria: dadosPrefixoAtual.dadosDiretoria.prefixo,
          pref_regional: dadosPrefixoAtual.dadosGerev.prefixo,
          pref_super: dadosPrefixoAtual.dadosSuper.prefixo,
          uor_trabalho: dadosPrefixoAtual.uor_dependencia
        };

      }
    }

    if (!userSubstituto) {
      dadosComissaoFunciLogado = await getDadosComissaoCompleto(user.cod_funcao);
    }

    return { user, funciLogado, dadosComissaoFunciLogado };
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDadosFunciOnline;