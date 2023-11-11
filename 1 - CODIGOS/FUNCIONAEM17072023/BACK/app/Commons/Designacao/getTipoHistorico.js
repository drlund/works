const hasPermission = use('App/Commons/HasPermission');

const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const TipoHistorico = use('App/Models/Mysql/Designacao/TipoHistorico');

const exception = use('App/Exceptions/Handler');

const _ = require('lodash');

const getPerfilFunci = use("App/Commons/Designacao/getPerfilFunci");
const getPerfilFunciSolicitacao = use("App/Commons/Designacao/getPerfilFunciSolicitacao");

const TIPOS_FUNCIS = [
  'funci_orig',
  'funci_dest',
  'funci_super_dest',
  'funci_gerev_dest',
  'funci_superadm',
  'funci_dipes',
  'funci_gepes',
  'funci_divar',
  'funci_dirav',
];

const TIPOS_GESTORES = [
  'gg_orig',
  'gg_dest',
  'funci_superadm',
  'super_regional_destino',
  'super_estadual_destino',
  'comite_super_destino',
  'comite_diretoria',
  'funci_gepes',
  'funci_dipes',
  'funci_divar',
  'funci_dirav',
];

const PERFIL = {
  gg_orig: {
    full: [6, 20],
    partial: [6]
  },
  funci_orig: {
    full: [20],
    partial: [6]
  },
  gg_dest: {
    full: [7, 20, 28],
    partial: [7]
  },
  funci_dest: {
    full: [20, 28],
    partial: [7]
  },
  funci_super_dest: {
    full: [17, 20, 21, 23],
    partial: [9]
  },
  funci_gerev_dest: {
    full: [17, 20, 21, 23, 28],
    partial: [8]
  },
  funci_superadm: {
    full: [10, 17, 19, 21, 22, 23, 26, 27, 28],
    partial: [10]
  },
  funci_dipes: {
    full: [11, 17, 19, 20, 22, 23],
    partial: [11]
  },
  funci_gepes: {
    full: [13, 17, 19, 20, 21, 22],
    partial: [13]
  },
  funci_divar: {
    full: [12, 17, 19, 20, 21, 23],
    partial: [12]
  },
  funci_dirav: {
    full: [12, 17, 19, 20, 21, 23],
    partial: [12]
  },
  comite_super_destino: {
    full: [8, 17, 20, 21, 23],
    partial: [8]
  },
  super_regional_destino: {
    full: [9, 17, 20, 21, 23, 28],
    partial: [9]
  },
  super_estadual_destino: {
    full: [8, 17, 20, 21, 23],
    partial: [9]
  }
}

async function getTipoHistorico(acesso, id_solicitacao, consulta, user) {

  try {
    let solicitacao = await Solicitacao.query()
      .where("id", parseInt(id_solicitacao))
      .with("prefixo_dest")
      .with("prefixo_orig")
      .with("analise")
      .first();

    solicitacao = solicitacao.toJSON();

    let perfFunci = await getPerfilFunci(user, id_solicitacao);
    let perfil = await getPerfilFunciSolicitacao(perfFunci.user, solicitacao, perfFunci.funciLogado, perfFunci.comiteAdm, perfFunci.dadosComissaoFunciLogado, perfFunci.funciIsAdmin);

    const nomeFerramenta = 'Designação Interina';

    const temPermissaoRegistro = await hasPermission({
      nomeFerramenta,
      dadosUsuario: user,
      permissoesRequeridas: ['REGISTRO']
    });

    const historicos = TipoHistorico.query();

    let perfilAcesso = [];
    if (temPermissaoRegistro && ![1, 5, 6].includes(solicitacao.id_situacao) && solicitacao.encaminhado_para !== '9009') perfilAcesso.push(20);
    if (temPermissaoRegistro && [1].includes(solicitacao.id_situacao)) perfilAcesso.push(20, 28);

    let perf = [];

    if (acesso === 'partial') {

      if (consulta === 'false') {
        perf.push.apply(perf, perfil.filter(p => TIPOS_FUNCIS.includes(p)));
        !_.isEmpty(perf) && perfilAcesso.push(...PERFIL[_.head(perf)][acesso]);
      }

      if (perfil.includes('funci_dest') || [user.chave].includes(solicitacao.matr_solicit)) {
        perfilAcesso.push(28);
      }
    }

    if (acesso === 'full') {
      perf = perfil.filter(p => {
        if (p === 'comite_diretoria') {
          return ['funci_divar', 'funci_dirav'].includes(p);
        }

        if (solicitacao.id_situacao === 7) {
          return ['funci_dest'].includes(p);
        }

        return TIPOS_GESTORES.includes(p);
      })
      !_.isEmpty(perf) && perfilAcesso.push(...PERFIL[_.head(perf)][acesso]);
      // !_.isEmpty(perf) && perfilAcesso.push(...PERFIL[_.head(perf)][acesso]);
    }

    let historics = [];

    if (!_.isEmpty(perfilAcesso)) {
      historicos.whereIn('id', perfilAcesso);

      historics = await historicos.fetch();

    }

    return historics;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getTipoHistorico;