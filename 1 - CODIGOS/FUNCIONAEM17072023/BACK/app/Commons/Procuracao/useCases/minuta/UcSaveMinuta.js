const { AbstractUserCase } = require('../../../AbstractUserCase');
const Diff = require('diff');
const { isUUID } = require('../utils');

class UcSaveMinuta extends AbstractUserCase {
  async _action({
    dadosMinuta,
    outorgado,
    poderes,
    tipoFluxo,
    matriculaRegistro,
  }) {
    return this.repository.saveMinuta({
      dadosMinuta: {
        customData: dadosMinuta.customData || '{}',
        diffs: dadosMinuta.diffs,
        idMinuta: dadosMinuta.idMinuta,
        idTemplate: dadosMinuta.idTemplate,
        idTemplateDerivado: dadosMinuta.idTemplateDerivado,
      },
      idFluxo: tipoFluxo.idFluxo,
      matriculaOutorgado: outorgado.matricula,
      outorgante: {
        idProcuracao: poderes.outorganteSelecionado.idProcuracao,
        idProxy: poderes.outorganteSelecionado.idProxy,
        subsidiariasSelected: poderes.outorganteSelecionado.subsidiariasSelected,
      },
      matriculaRegistro,
    }).catch(err => {
      // if sql errors
      if (err.errno) {
        this._throwExpectedError(err.sqlMessage);
      }
      throw err;
    });
  }

  async _checks({
    dadosMinuta,
    outorgado,
    poderes,
    tipoFluxo,
    matriculaRegistro,
  }) {
    if (!matriculaRegistro) {
      throw new Error('Usuário não está logado.');
    }

    if (!tipoFluxo.idFluxo) {
      throw new Error("É necessário passar o tipo do fluxo.");
    }

    if (!dadosMinuta.idMinuta) {
      throw new Error("É necessário criar um ID da minuta.");
    }

    if (!isUUID(dadosMinuta.idMinuta)) {
      throw new Error("É necessário passar um ID da minuta válido.");
    }

    if (!dadosMinuta.diffs || dadosMinuta.diffs.length === 0) {
      throw new Error("Necessário haver diffs da minuta.");
    }

    const subsidiariasSelected = poderes.outorganteSelecionado.subsidiariasSelected;
    if (!Array.isArray(subsidiariasSelected)) {
      throw new Error("Subsidiarias precisa ser uma lista.");
    }

    if (subsidiariasSelected.length === 0) {
      throw new Error("É necessario selecionar algum poder.");
    }

    if (!dadosMinuta.idTemplate && !dadosMinuta.idTemplateDerivado) {
      throw new Error("É necessário passar qual o template utilizado.");
    }

    if (dadosMinuta.idTemplate && dadosMinuta.idTemplateDerivado) {
      throw new Error("Indicar apenas um template usado.");
    }

    const fluxo = await this.repository.getOneFluxoMinuta(tipoFluxo.idFluxo);

    if (tipoFluxo.minuta !== fluxo.minuta) {
      throw new Error("Fluxo usado não foi encontrado.");
    }

    const minutaTemplate = await this.repository.getMinutaTemplateByFluxo(tipoFluxo.idFluxo);

    if (!minutaTemplate) {
      throw new Error("Template da minuta não foi encontrada.");
    }

    // diff applyPatch retorna false se o source for incompatível
    if (!Diff.applyPatch(minutaTemplate.templateBase, dadosMinuta.diffs)) {
      throw new Error("Minuta template usada não compatível.");
    }

    const outorgadoEncontrado = await this.functions.getOneFunci(outorgado.matricula);

    if (!outorgadoEncontrado) {
      throw new Error("Outorgado não encontrado.");
    }

    // from pesquisa controller
    const [procuracao] = await this.functions.getProcuracao({
      idProcuracao: poderes.outorganteSelecionado.idProcuracao,
      idProxy: poderes.outorganteSelecionado.idProxy,
    });

    if (!procuracao) {
      throw new Error("Procuração do outorgante não encontrada.");
    }
  }
}

module.exports = UcSaveMinuta;
