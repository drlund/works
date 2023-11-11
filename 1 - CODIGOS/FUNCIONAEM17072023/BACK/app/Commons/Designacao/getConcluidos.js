const exception = use("App/Exceptions/Handler");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const getQtdeDias = use("App/Commons/Designacao/getQtdeDias");
const _ = require("lodash");
const getPerfilFunci = use("App/Commons/Designacao/getPerfilFunci");
const getListaSolicitacoes = use("App/Commons/Designacao/getListaSolicitacoes");
const getDadosConsulta = use("App/Commons/Designacao/getDadosConsulta");
const { isAdmin, getDadosComissaoCompleto, isComissaoNivelGerencial } = use("App/Commons/Arh");

const PERFIL = {
  gg_orig: "gg_orig",
  gg_dest: "gg_dest",
  gerente_super_orig: "gerente_super_orig",
  gerente_super_dest: "gerente_super_dest",
  funci_superadm: "funci_superadm",
  funci_dipes: "funci_dipes",
  funci_gepes: "funci_gepes",
  funci_divar: "funci_divar",
  funci_dirav: "funci_dirav",
};

const PREFIXOS = {
  SUPERADM: "9009",
  DIPES: "8559",
  DIVAR: "8592",
  DIRAV: "9220",
};

const TIPOS_ACESSO = {
  "1": "SUPERADM",
  "2": "AGENCIAS",
  "3": "DIPES",
  "4": "DIVAR",
  "5": "DIRAV",
  "6": "OUTROS",
};

const motivos = (id, tipo, superReg = false) => {
  const motvs = {
    1: {
      motivo: '1o. NÍVEL GERENCIAL'
    },
    2: {
      motivo: 'UN COM APENAS 1 DOTAÇÃO DE 3o. NÍVEL GERENCIAL'
    },
    3: {
      motivo: '3o. NÍVEL GERENCIAL DE UN AUSENTE POR LIC. SAÚDE 60 DIAS'
    },
    4: {
      motivo: 'LICENÇA MATERNIDADE OU ADOÇÃO'
    },
    5: {
      motivo: 'NÍVEL GERENCIAL PARA COMPOSICAO TEMPORARIA'
    },
    6: {
      motivo: '3o. GUN AFASTADO P/ APURAÇÃO DISCIPLINAR ACIMA DE 60 DIAS'
    },
    7: {
      motivo: 'LIC. SAÚDE - DOTAÇÃO DE ATÉ 7 FUNCIONÁRIOS'
    },
    8: {
      motivo: 'FUNCIONÁRIOS CEDIDOS'
    },
    9: {
      motivo: 'PLATAFORMA - EXPANSÃO VAREJO'
    },
    10: {
      motivo: 'ADIÇÃO NO INTERESSE DO SERVIÇO'
    },
    11: {
      motivo: 'ADIÇÃO PARA COMPOSICAO TEMPORARIA DE EQUIPE'
    },
  }

  if (tipo === 1) {
    if ([1, 3, 4, 11].includes(id)) {
      return motvs[1].motivo;
    }
    if ([6].includes(id)) {
      return motvs[2].motivo;
    }
    if ([7].includes(id)) {
      return motvs[3].motivo;
    }
    if ([13].includes(id)) {
      return motvs[4].motivo;
    }
    if ([].includes(id)) {
      return motvs[5].motivo;
    }
    if ([7].includes(id)) {
      return motvs[6].motivo;
    }
    if ([5].includes(id)) {
      return motvs[7].motivo;
    }
    if ([].includes(id)) {
      return motvs[8].motivo;
    }
    if ([9].includes(id)) {
      return motvs[9].motivo;
    }
    if ([2, 3, 10, 12].includes(id) && superReg) {
      return motvs[10].motivo;
    }
  }

  if (tipo === 2) {
    if ([9].includes(id)) {
      return motvs[4].motivo;
    }
  }
}

async function getConcluidos(usuario, tipoAcesso) {

  try {

    // let {funciAdm, user, prefixos, nivelGer} = await getDadosConsulta(usuario);
    let {user, funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin, subordinadas} = await getPerfilFunci(usuario);

    let concluidos = await getListaSolicitacoes(
      null,
      {
        id_status: 2,
        id_situacao: 5,
        concluido: 0,
      },
      user,
      { tipo: "concluidos", valor: tipoAcesso },
      subordinadas,
      {funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin}
    );

    // concluidos = await Promise.all(concluidos);

    return concluidos;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getConcluidos;
