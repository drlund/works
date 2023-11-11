"use strict";

const exception = use("App/Exceptions/Handler");

class UcGravarSuspensao {
  /**
   * @param {import("../Repositories/ParametroSuspensaoRepository")} ParametroSuspensaoRepository
   * @param {import("../Factories/ParamSuspensoesIncluirFactory")} ParamSuspensoesIncluirFactory
   */
  constructor(ParametroSuspensaoRepository, ParamSuspensoesIncluirFactory) {
    this.ParametroSuspensaoRepository = ParametroSuspensaoRepository;
    this.ParamSuspensoesIncluirFactory = ParamSuspensoesIncluirFactory;
    this.validated = false;
  }

  /**
   * @param {string} usuario
   * @param {string} novaSuspensao
   */
  async validate(usuario, novaSuspensao) {
    this.usuario= usuario;
    this.novaSuspensao = novaSuspensao;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const dados = {...this.novaSuspensao, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario}
    const dadosPreparados = await this.ParamSuspensoesIncluirFactory.incluirSuspensao(dados);
    const suspensaoGravada = await this.ParametroSuspensaoRepository.gravarSuspensao(dadosPreparados);

    return suspensaoGravada;
  }
}

module.exports = UcGravarSuspensao;
