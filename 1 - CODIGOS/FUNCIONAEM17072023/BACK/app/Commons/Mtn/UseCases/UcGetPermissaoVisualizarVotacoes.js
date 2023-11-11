"use strict";

class UcGetPermissaoVisualizarVotacoes {
  constructor(visoesRepository, comiteVotacaoRepository) {
    this.visoesRepository = visoesRepository;
    this.comiteVotacaoRepository = comiteVotacaoRepository;
  }

  async validate(matricula) {
    this.matricula = matricula;
  }

  async run() {
    const { membrosComiteAdm, membrosComiteExpandido } =
      await this.comiteVotacaoRepository.getMembrosComiteMtn();

    const matriculasComite = this._getMatriculasComite(
      membrosComiteAdm,
      membrosComiteExpandido
    );

    const permissao = matriculasComite.includes(this.matricula);

    return permissao;
  }

  _getMatriculasComite(membrosComiteAdm, membrosComiteExpandido) {
    const matriculasComite = [
      ...membrosComiteAdm.map((membroComite) => membroComite.matricula),
      ...membrosComiteExpandido.map((membroComite) => membroComite.matricula),
    ];

    return matriculasComite;
  }
}

module.exports = UcGetPermissaoVisualizarVotacoes;
