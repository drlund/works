"use strict";
const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const Database = use("Database");

const AvaliacoesFactory = use(
  "App/Commons/Ambiencia/ModelFactory/AvaliacoesFactory"
);
class UCRegistrarAvaliacao {
  constructor(
    PrefixosLockRepository,
    AvaliacaoRepository,
    AmbientesRepository
  ) {
    this.prefixosLockRepository = new PrefixosLockRepository();
    this.avaliacaoRepository = new AvaliacaoRepository();
    this.ambientesRepository = new AmbientesRepository();
    this.avaliacoesFactory = new AvaliacoesFactory();
    this.validated = false;
  }

  async validate(idLock, avaliacoes, usuario) {
    const lock = await this.prefixosLockRepository.getLockById(idLock);
    if (lock.matricula !== usuario.chave) {
      throw new exception(
        `Prefixo não está reservado para avaliação do usuário ${usuario.chave}`,
        400
      );
    }

    const isAvaliacoesValidas = this._isAvaliacoesValidas(avaliacoes);

    if (!isAvaliacoesValidas) {
      throw new exception(`Avaliação sem campo obrigatório preenchido!`, 400);
    }

    this.lock = lock;
    this.usuario = usuario;
    this.avaliacoes = avaliacoes;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
    const trx = await Database.connection("ambiencia").beginTransaction();

    try {
      const avaliacoesComRegraAmbiente = await this._incluirRegraAmbiente(
        this.avaliacoes
      );

      const transformedAvaliacoes = this.avaliacoesFactory.transformToDatabase(
        avaliacoesComRegraAmbiente,
        this.lock,
        this.usuario
      );

      await this.avaliacaoRepository.gravarAvaliacoes(
        transformedAvaliacoes,
        trx
      );

      await this.prefixosLockRepository.removerLock(this.lock.id, trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  /**
   *  Recebe uma lista de avaliações e retorna uma cópida dela como id de Regra do ambiente
   *
   *  @param {*} avaliacoes
   *
   */
  async _incluirRegraAmbiente(avaliacoes) {
    const avaliacoesComRegraAmbiente = [];
    for (const avaliacao of avaliacoes) {
      const regraAmbiente =
        await this.ambientesRepository.getRegraAmbienteByIdAmbiente(
          avaliacao.ambienteTipo
        );
      avaliacoesComRegraAmbiente.push({
        ...avaliacao,
        idRegraAmbiente: regraAmbiente.id,
      });
    }

    return avaliacoesComRegraAmbiente;
  }

  _isAvaliacoesValidas(avaliacoes) {
    const camposObrigatorios = ["ambienteTipo", "nota", "qtdImagens"];

    for (const avaliacao of avaliacoes) {
      for (const campoObrigatorio of camposObrigatorios) {
        if (!avaliacao[campoObrigatorio]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = UCRegistrarAvaliacao;
