const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetDadosEnvolvido extends AbstractUserCase {
  async _checks({ idEnvolvido }) {
    if (!idEnvolvido) {
      throw new Error("O id do envolvido é obrigatório");
    }
    this.idEnvolvido = idEnvolvido;
  }

  async _action() {
    const dadosEnvolvido =
      await this.repository.envolvido.getDadosCompletosEnvolvido(
        this.idEnvolvido
      );
    return dadosEnvolvido;
  }
}

module.exports = UcGetDadosEnvolvido;
