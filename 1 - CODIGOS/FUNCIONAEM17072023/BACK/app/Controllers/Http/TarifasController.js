"use strict";

const {
  getPublicoAlvo,
  ReservarOcorrencia,
  GetOneOcorrencia,
  GetReservasPendentesPgtoEspecie,
  GetReservasPendentesPgtoConta,
  RegistrarPagamento,
  GetPermissaoPgtoConta,
  GetPagamentosPendentesConfirmacao,
  ConfirmarPagamento,
  CancelarPagamento,
  CancelarReserva,
  GetReservasFinalizadas,
} = use("App/Commons/Tarifas/useCases/useCasesTarifas");
const commonsTypes = require("../../Types/TypeUsuarioLogado");
const exception = use("App/Exceptions/Handler");
const { getFilesFromRequest } = use("App/Commons/FileUtils");
var fs = require("fs");
const { ok } = require("assert");

class TarifasController {
  
  /**
   *
   *   Rota que retorna as ocorrências pendentes de pagamento
   *
   */

  async getPublicoAlvo({ request, response, session, transform }) {
    const { mci, nomeCliente, cpf_cnpj } = request.allParams();
    try {
      const ocorrencias = await getPublicoAlvo({ mci, nomeCliente, cpf_cnpj });

      const transformedPendentes = await transform.collection(
        ocorrencias.pendentes,
        "Tarifas/OcorrenciasTransformer"
      );
      const transformedEmAndamento = await transform.collection(
        ocorrencias.emAndamento,
        "Tarifas/OcorrenciasTransformer"
      );
      return response.ok({
        pendentes: transformedPendentes,
        emAndamento: transformedEmAndamento,
      });
    } catch (error) {
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async getReservasPendentesPagamentoEspecie({
    request,
    response,
    session,
    transform,
  }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const useCaseReservasPendentesPgtoEspecie =
      new GetReservasPendentesPgtoEspecie(dadosUsuario);

    const reservas = await useCaseReservasPendentesPgtoEspecie.run();
    const transformed = await transform.collection(
      reservas,
      "Tarifas/ReservasTransformer.pendentesEspecie"
    );
    return response.ok(transformed);
  }

  async getReservasPendentesPagamentoConta({
    request,
    response,
    session,
    transform,
  }) {
    try {
      /** @type {commonsTypes.UsuarioLogado} */
      const dadosUsuario = session.get("currentUserAccount");

      const useCaseReservasPendentesPgtoConta =
        new GetReservasPendentesPgtoConta(dadosUsuario);

      const reservas = await useCaseReservasPendentesPgtoConta.run();
      const transformed = await transform.collection(
        reservas,
        "Tarifas/ReservasTransformer.pendentesEspecie"
      );
      return response.ok(transformed);
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async getReservasFinalizadas({ request, response, session, transform }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const useCaseGetFinalizadas = new GetReservasFinalizadas(dadosUsuario);
    const reservas = await useCaseGetFinalizadas.run();
    const transformed = await transform.collection(
      reservas,
      "Tarifas/ReservasTransformer.finalizadas"
    );
    return response.ok(transformed);
  }

  async getPermPgtoConta({ request, response, session, transform }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");
    const useCaseGetPermissaoPgtoConta = new GetPermissaoPgtoConta(
      dadosUsuario
    );
    try {
      const podePagar = await useCaseGetPermissaoPgtoConta.run();
      return response.ok(podePagar);
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async confirmarPgto({ request, response, session, transform }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");
    const { idPagamento, observacao } = request.allParams();

    try {
      const useCaseConfirmarPagamento = new ConfirmarPagamento(
        idPagamento,
        dadosUsuario,
        observacao
      );
      await useCaseConfirmarPagamento.run();
      return response.ok();
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async cancelarReserva({ request, response, session, tranform }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");
    const { idReserva, observacao } = request.allParams();

    try {
      const useCaseCancelarReserva = new CancelarReserva(
        idReserva,
        dadosUsuario,
        observacao
      );
      await useCaseCancelarReserva.run();
      return response.ok();
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }

    return response.ok();
  }

  async cancelarPgto({ request, response, session, tranform }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const { idPagamento, observacao } = request.allParams();

    try {
      const useCaseCancelarPagamento = new CancelarPagamento(
        idPagamento,
        dadosUsuario,
        observacao
      );
      await useCaseCancelarPagamento.run();
      return response.ok();
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async getPendentesConfirmacaoPgto({ request, response, session, transform }) {
    try {
      /** @type {commonsTypes.UsuarioLogado} */
      const dadosUsuario = session.get("currentUserAccount");

      const useCaseReservasPendentesConfirmacaoPgto =
        new GetPagamentosPendentesConfirmacao(dadosUsuario);

      const pagamentos = await useCaseReservasPendentesConfirmacaoPgto.run();
      const transformed = await transform.collection(
        pagamentos,
        "Tarifas/PagamentosTransformer.pendentesConfirmacaoPgto"
      );
      return response.ok(transformed);
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async getDadosOcorrencia({ request, response, session, transform }) {
    const { idOcorrencia } = request.allParams();

    const useCaseGetOneOcorrencia = new GetOneOcorrencia(idOcorrencia);
    const ocorrencia = await useCaseGetOneOcorrencia.run();
    const transformed = await transform.item(
      ocorrencia,
      "Tarifas/OcorrenciasTransformer.oneOcorrencia"
    );
    return response.ok(transformed);
  }

  async reservarOcorrencia({ request, response, session, transform }) {
    const params = request.allParams();
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    try {
      const useCaseReservaOcorrencia = new ReservarOcorrencia(
        {
          idOcorrencia: params.idOcorrencia,
          contatos: params.contatos,
          dadosPagamento: params.dadosPagamento,
          observacoes: params.dadosPagamento.observacoes,
        },
        dadosUsuario
      );
      await useCaseReservaOcorrencia.run();
      return response.ok("Reserva feita com sucesso");
    } catch (error) {
      if (error.message) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async registrarPagamento({ request, response, session, transform }) {
    const { dataPagamento, idOcorrencia, observacoes } = request.allParams();

    const anexos = getFilesFromRequest(request);

    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    try {
      const useCaseRegistrarPagamento = new RegistrarPagamento(
        {
          idOcorrencia,
          dataPagamento,
          observacoes,
          anexos,
        },
        dadosUsuario
      );

      await useCaseRegistrarPagamento.run();
      return response.ok("Pagamento cadastrado com sucesso");
    } catch (error) {
      if (error.message) {
        throw new exception(error.message, error.status ? error.status : 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }

}

module.exports = TarifasController;
