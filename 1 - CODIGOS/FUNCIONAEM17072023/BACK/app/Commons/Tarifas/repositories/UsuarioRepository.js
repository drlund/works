"use strict";

const hasPermission = use("App/Commons/HasPermission");
const { caminhoModels } = use("App/Commons/Tarifas/constants");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ocorrenciaTarifasModel = use(`${caminhoModels}/Ocorrencias`);
const isComissaoNivelGerencial = use(
  "App/Commons/Arh/isComissaoNivelGerencial"
);

class UsuarioRepository {
  constructor(dadosUsuario) {
    this.dadosUsuario = dadosUsuario;
  }

  async isAdminTarifas() {
    const isAdmin = await hasPermission({
      nomeFerramenta: "Tarifas",
      dadosUsuario: this.dadosUsuario,
      permissoesRequeridas: ["ADMIN"],
    });
    return isAdmin;
  }

  async possuiPermissaoPgtoConta() {
    const permissaoGravarPgtoConta = await hasPermission({
      nomeFerramenta: "Tarifas",
      dadosUsuario: this.dadosUsuario,
      permissoesRequeridas: ["PGTO_CONTA"],
    });

    return permissaoGravarPgtoConta;
  }

  async getPrefixosAcessoConfirmarPgto() {
    const prefixos = [];
    const isNivelGerencial = await isComissaoNivelGerencial(
      this.dadosUsuario.cod_funcao
    );

    if (isNivelGerencial) {
      prefixos.push(this.dadosUsuario.prefixo);
    }

    return prefixos;
  }

  async podePagarEmConta() {
    const isAdminTarifas = await this.isAdminTarifas();
    const permissaoGravarPgtoConta = await this.possuiPermissaoPgtoConta();

    return isAdminTarifas || permissaoGravarPgtoConta;
  }

  async temPermissaoOcorrencia(idOcorrencia) {
    const ocorrencia = await ocorrenciaTarifasModel.find(idOcorrencia);
  }
}

module.exports = UsuarioRepository;
