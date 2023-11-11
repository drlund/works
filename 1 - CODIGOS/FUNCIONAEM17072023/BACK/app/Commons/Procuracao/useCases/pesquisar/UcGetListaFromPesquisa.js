const { AbstractUserCase } = require('../../../AbstractUserCase');

class UcGetListaFromPesquisa extends AbstractUserCase {
  async _action(pesquisa, maisRecente = false) {
    if (isNaN(Number(pesquisa)) || pesquisa.length > 4) {
      return maisRecente
        ? this.repository.getIdsPorPesquisaPessoaMaisRecente(pesquisa)
        : this.repository.getIdsPorPesquisaPessoa(pesquisa);
    }

    return maisRecente
      ? this.repository.getIdsPorPesquisaPrefixoMaisRecente(pesquisa)
      : this.repository.getIdsPorPesquisaPrefixo(pesquisa);
  }

  _checks(pesquisa) {
    if (typeof pesquisa !== "string") {
      throw new Error("O termo de pesquisa precisa ser string");
    }
    if (!pesquisa || pesquisa.length === 0) {
      throw new Error("O termo de pesquisa não pode ser vazio");
    }
  }
}

module.exports = UcGetListaFromPesquisa;
