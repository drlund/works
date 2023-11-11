"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const { mtnConsts } = require("../../Constants");
const {  acoes } = mtnConsts;

class UcDevolverMedidaParaAnalise extends AbstractUserCase {
  async _checks({ idEnvolvido, usuarioLogado }) {

    if (!idEnvolvido) {
      throw new Error("É obrigado informar o id do envolvido.");
    }

    const isEnvolvidoPendenteAprovacao =
      await this._verificaEnvolvidoPendenteAprovacao(idEnvolvido);

    if(isEnvolvidoPendenteAprovacao === false){
      throw new Error("Envolvido não está pendente de aprovação.");
    }

    this.idEnvolvido = idEnvolvido;
    this.usuarioLogado = usuarioLogado;

  }

  async _action(){
    await this._desmarcarEnvolvidoComoPendenteAprovacao();
    await this._inserirTimelineDevolucao();
  }

  async _inserirTimelineDevolucao(){
    await this.functions.insereTimeline({
      idEnvolvido: this.idEnvolvido,
      idAcao: acoes.DEVOLVER_PARA_ANALISE,
      dadosRespAcao: this.usuarioLogado,
      tipoNotificacao: null,
      trx: this.trx
    });
  }

  async _desmarcarEnvolvidoComoPendenteAprovacao(){
    await this.repository.envolvido.update(this.idEnvolvido, {
      aprovacao_pendente: false,
      enviado_aprovacao_em: null
    }, this.trx);
  }

  async _verificaEnvolvidoPendenteAprovacao(idEnvolvido) {
    const dadosEnvolvido = await this.repository.envolvido.getDadosEnvolvido({
      idEnvolvido,
    });

    return dadosEnvolvido.aprovacao_pendente === true;
  }
}

module.exports = UcDevolverMedidaParaAnalise;
