"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const { MATRICULA_REGEX } = require("../Constants");
const Funci = require("../Entidades/Funci");

class UCObterDadosFunci extends AbstractUserCase {
  async _checks(matricula, usuario) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }

    if (!matricula) {
      throw new Error("Usuário não informado.");
    }
    if (!MATRICULA_REGEX.test(matricula)) {
      throw new Error("Matrícula incompleta.");
    }
  }
  async _action(matricula) {
    const { arhMst, solicitacoes } = this.repository;
    const consulta = await arhMst.obterDadosFunci(matricula);

    const resultado = Funci.transformPesquisaFuncionario(consulta);

    // resescreve a super pra todos e troca esse if pra se if diretoria nao alterar
    if (resultado?.prefixoOrigem?.prefixoDiretoria == "9600") {
      const results = await solicitacoes.substituiSuper(
        resultado.prefixoOrigem.prefixo
      );
      if (results[0].nome) {
        resultado.prefixoOrigem.prefixoSuper = results[0].prefixo;
        resultado.prefixoOrigem.nomeSuper = results[0].nome;
      }
    }

    const diretoriasParteFerramenta =
      await solicitacoes.podeCriarSolicitacaoNasDiretoriasInformadas(
        resultado.prefixoOrigem.prefixoDiretoria,
        resultado.prefixoOrigem.prefixoDiretoria
      );

    if (diretoriasParteFerramenta === false) {
      this._throwExpectedError(
        "Diretoria atual da matrícula informada não é alvo desta ferramenta.",
        400
      );
    }

    return resultado;
  }
}

module.exports = UCObterDadosFunci;
