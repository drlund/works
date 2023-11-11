"use strict";

// const { image } = require("pdfkit");

const exception = use("App/Exceptions/Handler");

class UCPrefixoToLock {
  constructor(PrefixosLockRepository, EventoRepository) {
    this.prefixosLockRepository = PrefixosLockRepository;
    this.eventoRepository = EventoRepository;
    this.validated = false;
  }

  async validate(idEvento, diretoriaParticipante, usuario) {
    // verifica se existe o evento
    const existeEvento = await this.eventoRepository.getEventoById(idEvento);
    if (existeEvento === null) {
      throw new exception(`Evento nº ${idEvento} não existe`, 400);
    }
    // verifica se existe diretoria participante e se é string de tamanho 4
    if (typeof diretoriaParticipante !== "string" && diretoriaParticipante.length <= 4) {
      throw new exception(
        `O Prefixo deve ser do tipo texto com tamanho 4.`,
        400
      );
    }
    // verifica se veio os dados do usuário logado
    if (!usuario) {
      throw new exception(
        "Os dados do usuário logado devem ser informados",
        400
      );
    }

    // permite usar os parametros já recebidos no método run
    // para evitar enviar novamente os mesmos parâmetros
    // adicionar os valores como parâmetro da classe
    this.idEvento = idEvento;
    this.diretoriaParticipante = diretoriaParticipante;
    this.usuario = usuario;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
    // a partir do evento informado selecionar um novo prefixo para avaliação
    const prefixoSelecionadoBySort =
      await this.prefixosLockRepository.getPrefixoSortToLock(
        this.idEvento,
        this.diretoriaParticipante
      );
    let prefixoLocked;
    if (prefixoSelecionadoBySort) {
      this.prefixoDataToLock = {
        idEvento: this.idEvento,
        diretoriaParticipante: this.diretoriaParticipante,
        prefixo: prefixoSelecionadoBySort.prefixo,
        subord: prefixoSelecionadoBySort.subord,
        matricula: this.usuario.chave,
        uor: prefixoSelecionadoBySort.uor,
      };
      prefixoLocked = await this.prefixosLockRepository.setLock(
        this.prefixoDataToLock,
        this.usuario
      );
    } else {
      prefixoLocked = { idLock: null };
    }
    return prefixoLocked;
  }
}

module.exports = UCPrefixoToLock;