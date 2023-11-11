"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetPareceresParaAprovacao extends AbstractUserCase {
  async _checks() {}

  async _action() {
    const medidasPendenciasAprovacao =
      await this.repository.envolvido.getPareceresPendentesAprovacao();

    const prazosSuperAprovacoes =
      await this.repository.envolvido.getPrazosSuperAprovacoes();

    const aprovacoes = {
      lote: [],
      individuais: [],
    };

    for (const medida of this._transform(medidasPendenciasAprovacao)) {
      medida.prazoPendenciaAnalise =
        prazosSuperAprovacoes.find((prazo) => prazo.id_envolvido == medida.id)
          ?.prazo_pendente_du || null;

      if (medida.idMedida === medida.idMedidaPrevista) {
        aprovacoes.lote.push(medida);
      } else {
        aprovacoes.individuais.push(medida);
      }
    }

    return aprovacoes;
  }

  _transform(aprovacoes) {
    return aprovacoes.map((aprovacao) => {
      return {
        id: aprovacao.id,
        idMtn: aprovacao.id_mtn,
        aprovacaoPendente: aprovacao.aprovacao_pendente,
        nrMtn: aprovacao.mtn.nr_mtn,
        matricula: aprovacao.matricula,
        envolvido: aprovacao.nome_funci,
        falha_consulta_dedip: aprovacao.falha_consulta_dedip,
        idMedida: aprovacao.id_medida,
        idMedidaPrevista: aprovacao.id_medida_prevista,
        medidaPrevista: aprovacao.medidaSugerida
          ? aprovacao.medidaSugerida?.txt_medida
          : "Não Informada",
        medida: aprovacao.medida?.txt_medida,
        analista: `${aprovacao.mat_resp_analise} - ${aprovacao.nome_resp_analise}`,
      };
    });
  }
}

module.exports = UcGetPareceresParaAprovacao;
