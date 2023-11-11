"use strict";

const { forEach } = require("lodash");
const { AbstractUserCase } = require("../../AbstractUserCase");
const Solicitacao = require("../Entidades/Solicitacao");
const FuncisRegionais = require("../../../Models/Mysql/Arh/FuncisRegionais");
const JurisdicoesSubordinadas = use("App/Models/Mysql/JurisdicoesSubordinadas");
const getAcessoExtra = require("../getAcessoExtra");

class UCDetalharSolicitacao extends AbstractUserCase {
  async _checks(id, usuario) {
    if (!id) {
      throw new Error("ID da solicitação não informado.");
    }

    const [podeAcessar, listaDeAcessosAutomaticos] = await Promise.all([
      this.functions.hasPermission({
        nomeFerramenta: "Flex Critérios",
        dadosUsuario: usuario,
        permissoesRequeridas: [
          "SOLICITANTE",
          "MANIFESTANTE",
          "ANALISTA",
          "DESPACHANTE",
          "EXECUTANTE",
          "ROOT",
          "DEFERIDOR",
        ],
      }),
      getAcessoExtra(usuario),
    ]);

    const testAcessos = listaDeAcessosAutomaticos.permissoes.some(
      (elelemento) =>
        /ROOT|SOLICITANTE|MANIFESTANTE|ANALISTA|DESPACHANTE|EXECUTANTE|ROOT|DEFERIDOR/.test(
          elelemento
        )
    );

    if (!podeAcessar && !testAcessos) {
      throw new Error(
        "Você não tem permissão para detalhar esta flexibilização."
      );
    }

    this.perfil_flex = listaDeAcessosAutomaticos.permissoes || null;
  }
  async _action(id, usuario) {
    const { solicitacoesRepository, suborinadasRepository } = this.repository;

    const detalharManifsOutrasDependencias = this.perfil_flex.some(
      (elelemento) =>
        /ROOT|ANALISTA|DESPACHANTE|EXECUTANTE|DEFERIDOR/.test(elelemento)
    );

    if (detalharManifsOutrasDependencias) {
      const consulta = await solicitacoesRepository.umaSolicitacaoPorId(
        id,
        this.trx
      );

      const consultaComTotalComites =
        await solicitacoesRepository.getTotalComitesByPrefixo(consulta);

      let resultado = Solicitacao.transformDetalharSolicitacao(
        consultaComTotalComites
      );

      return resultado;
    }

    const funciPrefixoVirtual = await FuncisRegionais.query()
      .where("matricula", usuario.matricula)
      .first();
    if (funciPrefixoVirtual) {
      usuario.prefixo = funciPrefixoVirtual.pref_gerev;
    }

    let jurisToJson = [];
    const unidadesGerevsSupers =
      await solicitacoesRepository.getUnidadesGerevsSupersByIdSoliticacao(id);

    if (
      usuario.prefixo == unidadesGerevsSupers[0].prefixoOrigem ||
      usuario.prefixo == unidadesGerevsSupers[0].prefixoDestino
    ) {
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoDestino}`,
      });
    }
    if (
      usuario.prefixo == unidadesGerevsSupers[0].gerevOrigem ||
      usuario.prefixo == unidadesGerevsSupers[0].gerevDestino
    ) {
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoDestino}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].gerevOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].gerevDestino}`,
      });
    }
    if (
      usuario.prefixo == unidadesGerevsSupers[0].superOrigem ||
      usuario.prefixo == unidadesGerevsSupers[0].superDestino
    ) {
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].prefixoDestino}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].gerevOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].gerevDestino}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].superOrigem}`,
      });
      jurisToJson.push({
        prefixo_subordinada: `${unidadesGerevsSupers[0].superDestino}`,
      });
    }

    const consulta = await solicitacoesRepository.umaSolicitacaoPorId(
      id,
      this.trx
    );

    const consultaComTotalComites =
      await solicitacoesRepository.getTotalComitesByPrefixo(consulta);

    let resultado = Solicitacao.transformDetalharSolicitacao(
      consultaComTotalComites
    );

    for (const [index, manifestacao] of resultado.manifestacoes.entries()) {
      if (!/Dispensa/.test(manifestacao.texto)) {
        const manifestacaoSubordinada = await jurisToJson.find(
          (sub) => sub.prefixo_subordinada == manifestacao.prefixo
        );

        if (manifestacaoSubordinada === (null || undefined)) {
          resultado.manifestacoes[index].parecer = null;
          resultado.manifestacoes[index].texto = null;
        }
      }
    }

    return resultado;
  }
}

module.exports = UCDetalharSolicitacao;
