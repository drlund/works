"use strict";

const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
const constants = use("App/Commons/Mtn/ComiteMtn/Constants");
const { TIPOS_VOTOS, QTD_VOTOS_COMITE, TIPO_VOTO_OBRIGATORIO } = constants;

class EntityComite {
  isVotacaoFinalizadaComoAprovada(comite) {
    let qtdVotos = 0;
    let isVotoObrigatorioRegistrado = false;

    for (const membroComite of comite) {
      if (membroComite.tipo_voto_id === TIPOS_VOTOS.ALTERAR) {
        throw new exception(
          `Existe um pedido de alteração nos parâmetros propostos.`,
          400
        );
      }

      const votoRegistrado =
        membroComite.votado_em !== null &&
        parseInt(membroComite.tipo_voto_id) === TIPOS_VOTOS.APROVAR;

      if (votoRegistrado) {
        qtdVotos++;
      }

      if (
        votoRegistrado &&
        parseInt(membroComite.tipo_votacao) === TIPO_VOTO_OBRIGATORIO
      ) {
        isVotoObrigatorioRegistrado = true;
      }
    }

    return qtdVotos >= QTD_VOTOS_COMITE && isVotoObrigatorioRegistrado;
  }
}

module.exports = EntityComite;
