const { AbstractUserCase } = require('../../../AbstractUserCase');
const { REGEX_MATRICULA } = require('../../../Regex');
const regexPrefixo = /^\d{1,4}$/;

class UcGetListaMinuta extends AbstractUserCase {
  async _action({ matricula, prefixo }) {
    if (matricula) {
      return this.repository.getMinutasMatricula(matricula);
    }

    return this.repository.getMinutasPrefixo(prefixo);
  }

  _checks({ matricula, prefixo }) {
    if (!matricula && !prefixo) {
      throw new Error("É necessário passar uma matricula ou prefixo");
    }

    if (matricula && prefixo) {
      throw new Error("É necessário passar apenas um de: matricula ou prefixo");
    }

    if (prefixo && !regexPrefixo.test(prefixo)) {
      throw new Error("Prefixo em formato inválido.");
    }

    if (matricula && !REGEX_MATRICULA.test(matricula)) {
      throw new Error("Matrícula em formato inválido.");
    }
  }
}

module.exports = UcGetListaMinuta;
