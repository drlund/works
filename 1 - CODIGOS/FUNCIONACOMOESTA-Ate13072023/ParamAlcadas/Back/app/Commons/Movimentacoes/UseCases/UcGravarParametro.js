"use strict";

class UcGravarParametro {
  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   * @param {import("../Factories/ParamAlcadasIncluirFactory")} ParamAlcadasIncluirFactory
   */
  constructor(ParametrosAlcadasRepository, ParamAlcadasIncluirFactory) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.ParamAlcadasIncluirFactory = ParamAlcadasIncluirFactory;
    this.validated = false;
  }

  /**
   * @param {string} usuario
   * @param {string} novoParametro
   */
  async validate(usuario, novoParametro) {
    this.novoParametro = novoParametro;
    this.usuario= usuario;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const dados = {...this.novoParametro, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario}
    const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(dados);
    const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(dadosPreparados);

    return parametroGravado;
  }
}

module.exports = UcGravarParametro;