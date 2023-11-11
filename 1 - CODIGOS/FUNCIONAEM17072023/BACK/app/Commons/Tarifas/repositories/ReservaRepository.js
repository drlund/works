"use strict";

const { caminhoModels } = use("App/Commons/Tarifas/constants");
const exception = use("App/Exceptions/Handler");
const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ReservasModel = use(`${caminhoModels}/Reservas`);
const { ESPECIE, CONTA_CORRENTE, ACAO_RESERVA, ACAO_CANCELOU_RESERVA } = use(
  "App/Commons/Tarifas/constants"
);

const LinhaTempoRepository = use(
  "App/Commons/Tarifas/repositories/LinhaTempoRepository"
);

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

class ReservaRespository {
  constructor() {
    this.linhaTempoRepository = new LinhaTempoRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  async getTipoPgto(idOcorrencia) {
    try {
      const reserva = await this.getReservaAtiva(idOcorrencia);
      return reserva.toJSON().tipoPagamento;
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async cancelarReserva(idReserva, observacao, dadosUsuario) {
    const trx = await Database.connection("tarifas").beginTransaction();
    try {
      const reserva = await ReservasModel.find(idReserva);
      reserva.ativa = 0;
      reserva.motivoCancelamento = observacao;

      await reserva.save(trx);

      await this.linhaTempoRepository.gravarLinhaTempo(
        reserva.idPublicoAlvo,
        dadosUsuario,
        ACAO_CANCELOU_RESERVA,
        trx
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async getReservaAtiva(idOcorrencia) {
    try {
      const reservaAtiva = await ReservasModel.query()
        .where("idPublicoAlvo", idOcorrencia)
        .where("ativa", 1)
        .orderBy("id", "desc")
        .first();

      return reservaAtiva ? reservaAtiva.toJSON() : null;
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async salvarReserva(reserva, usuarioLogado) {
    const trx = await Database.connection("tarifas").beginTransaction();
    try {
      const reservasModel = new ReservasModel();
      reservasModel.idPublicoAlvo = reserva.idOcorrencia;
      reservasModel.observacoes = reserva.observacoes
        ? reserva.observacoes
        : null;
      reservasModel.matriculaFunciReserva = usuarioLogado.chave;
      reservasModel.nomeFunciReserva = usuarioLogado.nome_usuario;
      reservasModel.prefixoDepFunciReserva = usuarioLogado.prefixo;
      reservasModel.nomeDepFunciReserva = usuarioLogado.dependencia;
      reservasModel.ativa = reserva.ativa;
      reservasModel.tipoPagamento = reserva.dadosPagamento.tipoPagamento;

      await reservasModel.save(trx);

      await reservasModel.contatos().createMany(
        reserva.contatos.map((contato) => {
          return {
            tipoContato: contato.tipoContato,
            telefone: contato.telefone,
            contato: contato.contato,
          };
        }),

        trx
      );

      if (reserva.dadosPagamento.tipoPagamento === CONTA_CORRENTE) {
        // Remoção da chave 'tipoPagamento' que é salvo na tabela reservas
        const { tipoPagamento, ...dadosPagamento } = reserva.dadosPagamento;
        await reservasModel.dadosPagamento().create(
          {
            ...dadosPagamento,
          },
          trx
        );
      }

      await this.linhaTempoRepository.gravarLinhaTempo(
        reserva.idOcorrencia,
        usuarioLogado,
        ACAO_RESERVA,
        trx
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async pendentesPagamentoEspecie(prefixosComAcessoParaPagamento) {
    try {
      const query = ReservasModel.query()
        .whereIn("prefixoDepFunciReserva", prefixosComAcessoParaPagamento)
        .where("tipoPagamento", ESPECIE)
        .where("ativa", 1);
      this._qbPendentesPagamento(query);
      const reservas = await query.fetch();
      return reservas.toJSON();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async getReservasFinalizadas(
    prefixos,
    incluirPgtoConta = false,
    isAdmin = false
  ) {
    const query = ReservasModel.query().where("ativa", 1);

    if (isAdmin === false) {
      query.where((builder) => {
        // No caso de pagamento em espécie a reserva deve ter sido feito por algúem do próprio prefixo ou
        // o pagamento ter sido feito por alguém do próprio prefixo
        builder.where((builder) => {
          builder.where("tipoPagamento", ESPECIE);
          builder.whereIn("prefixoDepFunciReserva", prefixos);
          builder.orWhereHas("ocorrencia", (builder) => {
            builder.whereHas("pagamentos", (builder) => {
              builder.whereIn("prefixoDepFunciPagamento", prefixos);
            });
          });
        });

        //Finalizadas pagas em conta
        if (incluirPgtoConta) {
          builder.orWhere((builder) => {
            builder.where("tipoPagamento", CONTA_CORRENTE);
          });
        }
      });
    }

    // Checa se finalizadas
    query
      .whereHas("ocorrencia", (builder) => {
        builder.whereHas("pagamentos", (builder) => {
          builder.where("ativa", 1);
          builder.whereHas("confirmacoes", (builder) => {
            builder.where("ativa", 1);
          });
        });
      })
      .with("ocorrencia", (builder) => {
        builder.with("dadosCliente");
        builder.with("pagamentos"),
          (builder) => {
            builder.with("ocorrencias");
          };
      });

    const reservas = await query.fetch();

    return reservas.toJSON();
  }

  async pendentesPagamentoConta() {
    try {
      const query = ReservasModel.query()
        .where("tipoPagamento", CONTA_CORRENTE)
        .where("ativa", 1);
      this._qbPendentesPagamento(query);

      const reservas = await query.fetch();
      return reservas.toJSON();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  _qbPendentesPagamento(query) {
    query
      .whereHas("ocorrencia", (builder) => {
        builder.whereDoesntHave("pagamentos", (builder) => {
          builder.where("ativa", 1);
        });
      })
      .with("ocorrencia", (builder) => {
        builder.with("dadosCliente");
      });
  }

  _qbFinalizadas(query) {}
}

module.exports = ReservaRespository;
