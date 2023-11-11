"use strict";
const { AbstractUserCase } = require("../../AbstractUserCase");

const moment = require("moment");
const { mtnConsts } = require("../../Constants")
const { acoes, tiposAnexo } = mtnConsts;

class UcAlterarMedidaNaAprovacao extends AbstractUserCase {

  async _checks({ idEnvolvido, novaMedida, novoParecer, dadosUsuario }) {
    if (!idEnvolvido) {
      throw new Error("É obrigatório informar o id do envolvido.");
    }

    if (!novaMedida || !novoParecer) {
      throw new Error(
        "Para o caso de alteração da medida, deve-se informar a nova medida e novo parecer."
      );
    }

    this.idEnvolvido = idEnvolvido;
    this.novaMedida = novaMedida;
    this.novoParecer = novoParecer;
    this.usuarioLogado = dadosUsuario;
  }

  async _action() {

    const envolvido = await this.repository.envolvido.getDadosEnvolvido({
      idEnvolvido: this.idEnvolvido,
    }, this.trx);

    const parecerOriginal = envolvido.txt_analise;
    const medidaOriginal = envolvido.id_medida;

    const dadosAprovacao = {
      analista_matricula: envolvido.mat_resp_analise,
      analista_nome: envolvido.nome_resp_analise,
      analise_em: moment().format("YYYY-MM-DD HH:mm"),
      id_envolvido: this.idEnvolvido,
      aprovador_matricula: this.usuarioLogado.chave,
      aprovador_nome: this.usuarioLogado.nome_usuario,

      id_medida_proposta: medidaOriginal,
      parecer_proposto: parecerOriginal,

      id_medida_aprovada: this.novaMedida,
      parecer_aprovado: this.novoParecer,

      alterado: true,
    };

    await this.repository.envolvido.salvarAprovacaoMedida(
      dadosAprovacao,
      this.trx
    );

    await this.repository.envolvido.update(
      this.idEnvolvido,
      {
        id_medida: this.novaMedida,
        txt_analise: this.novoParecer,
        mat_resp_analise: this.usuarioLogado.chave,
        nome_resp_analise: this.usuarioLogado.nome_usuario,
      },
      this.trx
    );

    await this.functions.insereTimeline({
      idEnvolvido: this.idEnvolvido,
      idAcao: acoes.ALTEROU_MEDIDA,
      dadosRespAcao: this.usuarioLogado,
      tipoNotificacao: null,
      trx: this.trx
    })

  }
}

module.exports = UcAlterarMedidaNaAprovacao;
