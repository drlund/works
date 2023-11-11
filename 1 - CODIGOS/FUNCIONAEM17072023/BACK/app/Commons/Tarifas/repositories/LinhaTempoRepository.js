"use strict";

const { caminhoModels, ACOES } = use("App/Commons/Tarifas/constants");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const linhaTempoModel = use(`${caminhoModels}/LinhaTempo`);

const StatusRepository = use(
  "App/Commons/Tarifas/repositories/StatusRepository"
);

const commonsTypes = require("../../../Types/TypeUsuarioLogado");
const Database = use("Database");

class LinhaTempoRepository {
  constructor() {
    this.statusRepository = new StatusRepository();
  }

  isAcaoLinhaTempoValida(acao) {
    return ACOES.includes(acao);
  }

  /**
   *
   * @param {*} idOcorrencia
   * @param {commonsTypes.UsuarioLogado} usuarioLogado
   * @param {*} acao
   */

  async gravarLinhaTempo(idOcorrencia, usuarioLogado, acao, trx) {
    const dadosLinhaTempo = {
      idPublicoAlvo: idOcorrencia,
      matriculaFunciAcao: usuarioLogado.chave,
      nomeFunciAcao: usuarioLogado.nome_usuario,
      acao,
    };

    await linhaTempoModel.create(dadosLinhaTempo, trx);

    await this.statusRepository.atualizarStatus(idOcorrencia, acao, trx);
    let teste = "";
  }
}

module.exports = LinhaTempoRepository;
