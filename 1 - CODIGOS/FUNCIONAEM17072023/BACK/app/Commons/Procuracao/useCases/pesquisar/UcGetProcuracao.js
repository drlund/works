const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcGetProcuracao extends AbstractUserCase {
  _checks({ idProxy, idProcuracao }) {
    if (!idProxy && !idProcuracao) {
      throw new Error("ID não pode ser vazio");
    }

    if (idProxy && idProcuracao) {
      throw new Error("Preencha apenas um dos ID");
    }
  }

  async _action({ idProxy, idProcuracao }) {
    const payload = await this.repository.getCadeiaDeProcuracaoById({
      idProxy: idProxy,
      idProcuracao: idProcuracao,
    });

    return payload ?? [];
  }
}

module.exports = UcGetProcuracao;
