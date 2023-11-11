"use strict";

const IncluirParametros = use("App/Models/Mysql/movimentacoes/ParamAlcadas");
class ParamAlcadasIncluirFactory {
  /**
   * @param {{
   * prefixoDestino: string;
   * nomePrefixo: string;
   * comissaoDestino: string;
   * nomeComissaoDestino: string;
   * comite: string;
   * nomeComite: string;
   * observacao: string; }}
   * novoParametro
   */
  async incluirParametro(novoParametro) {
    const gravarParametro = new IncluirParametros();
    gravarParametro.prefixoDestino = novoParametro.prefixoDestino;
    gravarParametro.nomePrefixo = novoParametro.nomePrefixo;
    gravarParametro.comissaoDestino = novoParametro.comissaoDestino;
    gravarParametro.nomeComissaoDestino = novoParametro.nomeComissaoDestino;
    gravarParametro.comite = novoParametro.comite;
    gravarParametro.nomeComite = novoParametro.nomeComite;
    gravarParametro.observacao = novoParametro.observacao;

    return gravarParametro;
  }
}

module.exports = ParamAlcadasIncluirFactory;
