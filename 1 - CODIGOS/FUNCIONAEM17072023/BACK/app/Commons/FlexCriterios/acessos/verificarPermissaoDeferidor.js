"use strict";

const { padStart } = require("lodash");
const { STATUS, SITUACOES, ETAPAS } = require("../Constants");
const ManifestacoesModel = use("App/Models/Mysql/FlexCriterios/Manifestacoes");
const { getListaComitesAdm } = use("App/Commons/Arh/dadosComites");

/**
 *Função que verifica se funcionário tem perfil funcionario deferidor
 */

const verificarPermissaoDeferidor = async (usuarioLogado) => {
  let usuarioPerfilDeferidor = false;

  if (/DIRETOR/.test(usuarioLogado.nome_funcao)) {
    return (usuarioPerfilDeferidor = true);
  }

  const deferimentosPendentes = await ManifestacoesModel.query()
    /*     .where("prefixo", usuarioLogado.prefixo) */
    .where("id_acao", ETAPAS.DEFERIMENTO)
    .where("id_situacao", SITUACOES.PENDENTE)
    .fetch();
  const deferimentosPendentesToJson = deferimentosPendentes?.toJSON() ?? null;

  if (deferimentosPendentesToJson) {
    for (const item of deferimentosPendentesToJson) {
      if (
        item.matricula == usuarioLogado.matricula ||
        item.matricula == usuarioLogado.matricula.padStart(5, 0)
      ) {
        usuarioPerfilDeferidor = true;
      }

      if (item.nomeFuncao && item.nomeFuncao == usuarioLogado.nome_funcao) {
        usuarioPerfilDeferidor = true;
      }

      if (!item.matricula) {
        const membrosDoComite = await getListaComitesAdm(usuarioLogado.prefixo);
        const funciMembroComite = membrosDoComite.find(
          (membro) => membro.MATRICULA_MEMBRO == usuarioLogado.matricula
        );

        usuarioPerfilDeferidor = funciMembroComite
          ? true
          : usuarioPerfilDeferidor;
      }
    }
  }

  return usuarioPerfilDeferidor;
};

module.exports = verificarPermissaoDeferidor;
