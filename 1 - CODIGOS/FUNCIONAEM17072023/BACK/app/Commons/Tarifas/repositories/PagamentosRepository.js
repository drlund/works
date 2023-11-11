"use strict";

const getPrefixosPorPso = use("App/Commons/Mst/getPrefixosPorPso");
const pagamentosModel = use("App/Models/Mysql/Tarifas/Pagamentos");
const commonsTypes = require("../../../Types/TypeUsuarioLogado");
const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const md5 = require("md5");
const { arquivoParaBase64 } = use("App/Commons/FileUtils");
var fs = require("fs");
const Helpers = use("Helpers");
const {
  ACAO_REGISTRO_PGTO,
  ACAO_CONFIRMA_REGISTRO_PGTO,
  ACAO_CANCELOU_REGISTRO_PGTO,
} = use("App/Commons/Tarifas/constants");

const LinhaTempoRepository = use(
  "App/Commons/Tarifas/repositories/LinhaTempoRepository"
);

const PUBLIC_PATH = "public/";
const ANEXOS_PATH = "uploads/tarifas/comprovantes_pagamento/";

class PagamentosRepository {
  constructor() {
    this.linhaTempoRepository = new LinhaTempoRepository();
  }

  async getPrefixosComAcessoParaPagamento(prefixoUsuarioLogado) {
    try {
      const prefixosAtendidosPeloPso = await getPrefixosPorPso(
        prefixoUsuarioLogado
      );
      return [...prefixosAtendidosPeloPso, prefixoUsuarioLogado];
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async isPagamentoConfirmado(idPagamento) {
    const pagamentos = await pagamentosModel
      .query()
      .where("id", idPagamento)
      .whereHas("confirmacoes", (builder) => {
        builder.where("ativa", 1);
      })
      .where("ativa", 1)
      .first();

    return pagamentos ? true : false;
  }

  async isPagamentoRegistrado(idOcorrencia) {
    const pagamentos = await this.getPagamentosOcorrencia(idOcorrencia);
    return pagamentos ? true : false;
  }

  async confirmarPagamento(idPagamento, observacao, dadosUsuario) {
    const trx = await Database.connection("tarifas").beginTransaction();

    try {
      const pagamento = await pagamentosModel.find(idPagamento);

      await pagamento.confirmacoes().create(
        {
          observacao,
          nomeFunciConfirmacao: dadosUsuario.nome_usuario,
          matriculaFunciConfirmacao: dadosUsuario.chave,
          prefixoDepFunciConfirmacao: dadosUsuario.prefixo,
          nomeDepFunciConfirmacao: dadosUsuario.dependencia,
          ativa: 1,
        },
        trx
      );

      await this.linhaTempoRepository.gravarLinhaTempo(
        pagamento.idPublicoAlvo,
        dadosUsuario,
        ACAO_CONFIRMA_REGISTRO_PGTO,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }

  async cancelarPagamento(idPagamento, observacao, dadosUsuario) {
    const trx = await Database.connection("tarifas").beginTransaction();
    try {
      const pagamento = await pagamentosModel.find(idPagamento);
      pagamento.ativa = 0;
      pagamento.motivoCancelamento = observacao;
      await pagamento.save(trx);

      await this.linhaTempoRepository.gravarLinhaTempo(
        pagamento.idPublicoAlvo,
        dadosUsuario,
        ACAO_CANCELOU_REGISTRO_PGTO,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      this.removerArquivos(arquivosCriados);
      throw new exception(error, 500);
    }
  }

  async getPagamentosPendentesConfirmacao(prefixosComAcessoParaConfirmar) {
    const pagamentos = await pagamentosModel
      .query()
      .where("ativa", 1)
      .whereIn("prefixoDepFunciPagamento", prefixosComAcessoParaConfirmar)
      .whereDoesntHave("confirmacoes", (builder) => {
        builder.where("ativa", 1);
      })
      .with("ocorrencia", (builder) => {
        builder.with("dadosCliente");
      })
      .orderBy("idPublicoAlvo", "asc")
      .fetch();

    return pagamentos.toJSON();
  }

  async getOnePagamento(idPagamento) {
    const pagamento = await pagamentosModel.find(idPagamento);
    await pagamento.load("ocorrencia");
    await pagamento.load("anexos");

    return pagamento.toJSON();
  }

  async getPagamentosOcorrencia(idOcorrencia) {
    const pagamentos = await pagamentosModel
      .query()
      .where("idPublicoAlvo", idOcorrencia)
      .where("ativa", 1)
      .first();

    return pagamentos ? pagamentos.toJSON() : null;
  }

  /**
   *
   * @param {*} dadosPagamento
   * @param {commonsTypes.UsuarioLogado} usuarioLogado
   * @returns
   */

  async registrarPagamento(dadosPagamento, usuarioLogado) {
    const trx = await Database.connection("tarifas").beginTransaction();
    const arquivosCriados = [];

    try {
      const pagamento = new pagamentosModel();
      pagamento.idPublicoAlvo = dadosPagamento.idOcorrencia;
      pagamento.dataPagamento = dadosPagamento.dataPagamento;
      pagamento.observacoes = dadosPagamento.observacoes;

      pagamento.matriculaFunciPagamento = usuarioLogado.chave;
      pagamento.prefixoDepFunciPagamento = usuarioLogado.prefixo;
      pagamento.nomeDepFunciPagamento = usuarioLogado.dependencia;
      pagamento.codFuncaoFunciPagamento = usuarioLogado.cod_funcao;
      pagamento.nomeFuncaoFunciPagamento = usuarioLogado.nome_funcao;
      pagamento.nomeFunciPagamento = usuarioLogado.nome_usuario;

      await pagamento.save(trx);

      fs.mkdirSync(Helpers.appRoot(PUBLIC_PATH + ANEXOS_PATH), {
        recursive: true,
      });

      for (const anexo of dadosPagamento.anexos) {
        const hash = md5(arquivoParaBase64(anexo.tmpPath));
        const nomeAnexo = `${dadosPagamento.idOcorrencia}_${hash}.${anexo.extname}`;
        const dadosArquivo = {
          idPagamento: pagamento.id,
          caminhoArquivo: ANEXOS_PATH,
          nomeArquivo: nomeAnexo,
          extensao: anexo.extname,
          mimeType: `${anexo.type}/${anexo.subtype}`,
          nomeOriginal: anexo.clientName,
          incluidoPor: usuarioLogado.chave,
          tamanhoArquivo: anexo.size,
          hash,
        };
        await pagamento.anexos().create(dadosArquivo, trx);
        await anexo.move(PUBLIC_PATH + ANEXOS_PATH, {
          name: nomeAnexo,
          overwrite: true,
        });
        arquivosCriados.push(PUBLIC_PATH + ANEXOS_PATH + nomeAnexo);
      }

      await this.linhaTempoRepository.gravarLinhaTempo(
        dadosPagamento.idOcorrencia,
        usuarioLogado,
        ACAO_REGISTRO_PGTO,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      this.removerArquivos(arquivosCriados);
      throw new exception(error, 500);
    }
  }

  async removerArquivos(listaArquivos) {
    //TODO Criar método para remover arquivos
  }
}

module.exports = PagamentosRepository;
