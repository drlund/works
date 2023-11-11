"use strict";
const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const constants = use("App/Commons/Ambiencia/Constants");

class UCPrefixoAvaliavel {
  constructor(
    UCPermissaoAcesso,
    UCPrefixoLocked,
    UCPrefixoToLock,
    EventoRepository,
    AmbientesRepository,
    AvaliacaoRepository
  ) {
    this.ucPermissaoAcesso = UCPermissaoAcesso;
    this.ucPrefixoLocked = UCPrefixoLocked;
    this.ucPrefixoToLock = UCPrefixoToLock;
    this.eventoRepository = EventoRepository;
    this.ambientesRepository = AmbientesRepository;
    this.avaliacaoRepository = AvaliacaoRepository;
    this.validated = false;
  }

  async validate(idEvento, usuario) {
    // verifica se existe o evento
    const existeEvento = await this.eventoRepository.getEventoById(idEvento);
    if (existeEvento === null)
      throw new exception(`Evento nº ${idEvento} não existe`, 400);
    // verifica se o usuário(ou seu prefixo) tem acesso
    await this.ucPermissaoAcesso.validate(
      idEvento,
      usuario.chave,
      usuario.prefixo,
      constants.POSSUI_ACESSO
    );
    const acesso = await this.ucPermissaoAcesso.run();
    if (!acesso)
      throw new exception(
        `Matrícula ${matricula} não pode registrar avaliação.`,
        400
      );

    this.idEvento = idEvento;
    this.evento = existeEvento;
    this.diretoriaParticipante = existeEvento.diretoriaParticipante;
    this.matricula = usuario.chave;
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

    let lockData;
    // checar se o prefixo já está lockado
    await this.ucPrefixoLocked.validate(this.idEvento, this.matricula);
    const prefixoLocked = await this.ucPrefixoLocked.run();
    if (prefixoLocked !== null) {
      lockData = prefixoLocked;
    } else {
      // lockar o prefixo
      await this.ucPrefixoToLock.validate(
        this.idEvento,
        this.diretoriaParticipante,
        this.usuario
      );
      lockData = await this.ucPrefixoToLock.run();
    }

    // se não existem mais prefixos para serem avaliados
    if (typeof lockData.prefixo === "undefined") {
      return lockData;
    }

    // consultar os ambientes do evento
    const ambientesParaAvaliacao =
      await this.ambientesRepository.getAmbientesByIdEvento(this.idEvento);
    const idsAmbientesParaAvaliacao = ambientesParaAvaliacao.map(
      (elem) => elem.idImagemTipo
    );

    // retornar os dados dos ambientes do evento
    const imagemToAvaliacao =
      await this.avaliacaoRepository.getDadosToAvaliacao(
        idsAmbientesParaAvaliacao,
        lockData.prefixo,
        lockData.cd_subord,
        {
          dataInicio: moment(
            this.evento.dataInicio,
            "DD/MM/YYYY HH:mm:ss"
          ).format("YYYY-MM-DD"),
          dataEncerramento: moment(
            this.evento.dataEncerramento,
            "DD/MM/YYYY HH:mm:ss"
          ).format("YYYY-MM-DD"),
        }
      );

    const idsTiposAmbientesIncluidos = imagemToAvaliacao.map(
      (imagem) => imagem.tipo
    );

    const ambientes = idsAmbientesParaAvaliacao
      .filter((id) => {
        return idsTiposAmbientesIncluidos.includes(id);
      })
      .map((idAmbiente) => {
        const ambienteOrientacao = ambientesParaAvaliacao.find(
          (instrucao) => instrucao.idImagemTipo === idAmbiente
        );
        const imagem = imagemToAvaliacao.find(
          (dadosAmbiente) => dadosAmbiente.ambiente.id === idAmbiente
        );
        const urls = imagemToAvaliacao
          .filter((imagem) => imagem.tipo === idAmbiente)
          .map((elemento) => {
            return {
              url: elemento["url"],
              dataInclusao: elemento["data_inclusao"],
            };
          });
        const resumo = {
          ambienteId: imagem.ambiente.id,
          ambienteDescricao: imagem.ambiente.descricao,
          ambienteTextoInstrucao: imagem.ambiente.texto_instrucoes,
          ambienteOrientacao: ambienteOrientacao.orientacoes,
          imagens: urls.slice(0, ambienteOrientacao.quantidadeImagens),
        };
        return resumo;
      });

    const dadosToAvaliacao = {
      idLock: lockData.id,
      ambientes: ambientes,
    };

    return dadosToAvaliacao;
  }
}

module.exports = UCPrefixoAvaliavel;
