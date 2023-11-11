"use strict";
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
const typeDefs = require("../../../Types/TypeUsuarioLogado");
const exception = use("App/Exceptions/Handler");
const UcGetPermissaoVisualizarVotacoes =
  use("App/Commons/Mtn/UseCases/UcGetPermissaoVisualizarVotacoes");
/**
 * Retorna os monitoramentos com parametros pendentes de votação e o usuário logado tenha acesso para votar.
 *
 */

class UcGetMonitoramentosParaVotacao {
  constructor(Visoesrepository, ComiteVotacaoRepository) {
    this.visoesRepository = Visoesrepository;
    this.comiteVotacaoRepository = ComiteVotacaoRepository;
  }

  async validate(usuarioLogado) {
    
    const ucGetPermissaoVisualizarVotacoes =
      new UcGetPermissaoVisualizarVotacoes(
        this.visoesRepository,
        this.comiteVotacaoRepository
      );

    await ucGetPermissaoVisualizarVotacoes.validate(usuarioLogado.chave);
    const podeVisualizarVotacoes = await ucGetPermissaoVisualizarVotacoes.run();

    if (!podeVisualizarVotacoes) {
      throw new exception(
        "Usuário não tem acesso visualizar as votações!",
        400
      );
    }

    /** @type {typeDefs.UsuarioLogado} */
    this.usuarioLogado = usuarioLogado;
  }

  async run() {
    const monitoramentos =
      await this.visoesRepository.getMonitoramentosParaVotacao(
        this.usuarioLogado.chave
      );
    return monitoramentos;
  }
}

module.exports = UcGetMonitoramentosParaVotacao;
