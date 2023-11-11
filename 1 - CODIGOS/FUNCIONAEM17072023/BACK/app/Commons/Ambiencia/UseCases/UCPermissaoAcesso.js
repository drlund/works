"use strict";
const exception = use("App/Exceptions/Handler");
const constants = use("App/Commons/Ambiencia/Constants");

class UCPermissaoAcesso {
  constructor(
    AcessoMatriculaRepository,
    AcessoPrefixoRepository,
    EventoRepository
  ) {
    this.acessoMatriculaRepository = AcessoMatriculaRepository;
    this.acessoPrefixoRepository = AcessoPrefixoRepository;
    this.eventoRepository = EventoRepository;
    this.validated = false;
  }

  async validate(idEvento, matricula, prefixo, tipoValidacao) {
    // verifica se existe o evento
    const existeEvento = await this.eventoRepository.getEventoById(idEvento);
    if (existeEvento === null) {
      throw new exception(`Evento nº ${idEvento} não existe`, 400);
    }

    // verifica se a matricula é string de tamanho 8
    if (typeof matricula !== "string" && matricula.length !== 8) {
      throw new exception(
        `A Matrícula deve ser do tipo texto com tamanho 8.`,
        400
      );
    }
    // verifica se o prefixo é string de tamanho 4
    if (typeof prefixo !== "string" && prefixo.length !== 4) {
      throw new exception(
        `O Prefixo deve ser do tipo texto com tamanho 4.`,
        400
      );
    }

    this.idEvento = idEvento;
    this.matricula = matricula;
    this.prefixo = prefixo;
    this.tipoValidacao = tipoValidacao;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    // verifica se o usuário tem acesso
    const existeAcessoMatricula =
      await this.acessoMatriculaRepository.getAcessoMatricula(
        this.matricula,
        this.idEvento
      );
    // verifica se o prefixo tem acesso
    const existeAcessoPrefixo =
      await this.acessoPrefixoRepository.getAcessoPrefixo(
        this.prefixo,
        this.idEvento
      );
    if (this.tipoValidacao === constants.POSSUI_ACESSO) {
      if (existeAcessoMatricula === null && existeAcessoPrefixo === null) {
        return false;
      }

      return true;
    }

    if (existeAcessoMatricula.idPerfilAcesso === constants.AVALIADOR_GERAL) {
      return existeAcessoMatricula;
    }
    if (existeAcessoPrefixo.idPerfilAcesso === constants.AVALIADOR_GERAL) {
      return existeAcessoPrefixo;
    }
  }
}

module.exports = UCPermissaoAcesso;
