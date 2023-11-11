const { AbstractUserCase } = require("../../AbstractUserCase");
const EnvolvidoEntity = require("../entities/Envolvido");
const { mtnConsts } = require("../../Constants");
const { acoes, mtnStatus } = mtnConsts;

class UcVersionarMedida extends AbstractUserCase {

  #envolvidoEntity = new EnvolvidoEntity();

  async _checks({ idEnvolvido, dadosUsuario, agora }) {
    const dadosEnvolvido = await this.repository.envolvido.getDadosEnvolvido(
      { idEnvolvido },
      this.trx
    );

    const isFinalizado = this.#envolvidoEntity.isFinalizado(dadosEnvolvido);
    if (!isFinalizado) {
      throw new Error("Somente uma ocorrência finalizada por ser versionada");
    }

    const isVersionado = this.#envolvidoEntity.isVersionado(dadosEnvolvido);
    if (isVersionado) {
      throw new Error("Está ocorrência já foi versionada");
    }

    this.idEnvolvido = idEnvolvido;
    this.idMtn = dadosEnvolvido.id_mtn;
    this.dadosUsuario = dadosUsuario;
    this.agora = agora;
  }

  async _action() {
    const novaVersaoEnvolvido = await this.#duplicarEnvolvido();
    await this.#marcarOcorrenciaOriginalComoVersionada({
      idNovaVersao: novaVersaoEnvolvido.id,
    });
    await this.#insereTimeLineOcorrenciaOriginal();
    await this.#insereTimeLineNovaOcorrencia(novaVersaoEnvolvido.id);
    await this.#reabrirMtn();
  }

  async #reabrirMtn(){
    await this.repository.mtn.update(this.idMtn, {
      id_status: mtnStatus.EM_ANALISE
    }, this.trx)
  }

  async #insereTimeLineNovaOcorrencia(idNovaVersao){
    await this.functions.insereTimeline(
      idNovaVersao,
      acoes.CRIACAO_NOVA_VERSAO,
      this.dadosUsuario,
      null,
      false,
      this.trx
    );
  }

  async #insereTimeLineOcorrenciaOriginal() {
    await this.functions.insereTimeline(
      this.idEnvolvido,
      acoes.VERSIONAR_OCORRENCIA,
      this.dadosUsuario,
      null,
      false,
      this.trx
    );
  }

  async #marcarOcorrenciaOriginalComoVersionada({ idNovaVersao }) {
    await this.repository.envolvido.update(
      this.idEnvolvido,
      {
        versionado: true,
        versionado_em: this.agora,
        versionado_por_matricula: this.dadosUsuario.chave,
        versionado_por_nome: this.dadosUsuario.nome_usuario,
        versao_id_nova: idNovaVersao,
      },
      this.trx
    );
  }

  async #duplicarEnvolvido() {
    const novaVersaoEnvolvido = await this.repository.envolvido.duplicar(
      this.idEnvolvido,
      this.trx
    );
    return novaVersaoEnvolvido;
  }

}

module.exports = UcVersionarMedida;
