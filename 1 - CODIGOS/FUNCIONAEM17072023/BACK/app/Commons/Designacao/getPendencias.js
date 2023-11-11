const exception = use("App/Exceptions/Handler");
const _ = require("lodash");

const { isPrefixoUN } = use("App/Commons/Arh");

const Constants = use("App/Commons/Designacao/Constants");
const getListaSolicitacoes = use("App/Commons/Designacao/getListaSolicitacoes");
const getPerfilFunci = use("App/Commons/Designacao/getPerfilFunci");

const {
  PERFIS_GETPENDENCIAS: PERFIL,
  PREFIXO_SUPERADM: SUPERADM,
  PREFIXO_DIPES: DIPES,
  PREFIXO_GEPES: GEPESDF,
  PREFIXO_DIVAR: DIVAR,
  PREFIXO_DIRAV: DIRAV,
} = Constants;

async function getPendencias(usuario, tipoAcesso) {
  try {

    // let {funciAdm, user, prefixos, nivelGer} = await getDadosConsulta(usuario);

    let {
      user,
      funciLogado,
      comiteAdm,
      dadosComissaoFunciLogado,
      funciIsAdmin,
      subordinadas
    } = await getPerfilFunci(usuario);

    const isUN = await isPrefixoUN(user.prefixo);

    let pendencias = await getListaSolicitacoes(
      null,
      { id_status: 1, concluido: 0 },
      user,
      { tipo: "pendentes", valor: tipoAcesso },
      subordinadas,
      {funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin}
    );

    let pends = [...pendencias];

    if (tipoAcesso === "1") {
      let pendsSelf = pends
        .filter((elem) => ["SIM", "NÃO"].includes(elem.situacaoSuperior))
        .map((elem) => {
          elem.self = 1;
          return elem;
        });
      let seuPends = pendsSelf.filter((elem) => elem.pendDeAcordo);
      let outrsPends = pendsSelf.filter((elem) => !elem.pendDeAcordo);
      let pendsSubord = pends
        .filter((elem) => elem.situacaoSuperior === "Não Obrigatório")
        .map((elem) => {
          elem.self = 0;
          return elem;
        });
      pendencias = [...seuPends, ...outrsPends, ...pendsSubord];
    }

    if (tipoAcesso === "2") {
      let pendsSelf = pends
        .filter((elem) => {
          const subs = isUN ? [...subordinadas] : [];
          return [...subs, user.prefixo].includes(elem.encaminhado_para)
        })
        .map((elem) => {
          elem.enc = 1;
          return elem;
        });
      let pendsSubord = pends
        .filter((elem) => {
          const subs = isUN ? [...subordinadas] : [];
          return ![...subs, user.prefixo].includes(elem.encaminhado_para)
        })
        .map((elem) => {
          elem.enc = 0;
          return elem;
        });
      pendencias = [...pendsSelf, ...pendsSubord];
    }

    if (tipoAcesso === "3") {
      let pendsSelf = pends
        .filter((elem) => {
          const subs = isUN ? [...subordinadas] : [];
          return [...subs, user.prefixo].includes(elem.encaminhado_para)
        })
        .map((elem) => {
          elem.enc = 1;
          return elem;
        });
      pendencias = [...pendsSelf];
    }

    let listaPriorizada = pendencias.filter(pendencia => pendencia.priorizado);
    let listaNaoPriorizada = pendencias.filter(pendencia => !pendencia.priorizado);

    pendencias = [...listaPriorizada, ...listaNaoPriorizada];

    return pendencias;
  } catch (err) {
    throw new exception(err,400);
  }
}

module.exports = getPendencias;
