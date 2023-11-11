"use strict";

const OpcoesDoFormGestao = use(
  "App/Models/Mysql/Patrocinios/OpcoesDoFormGestao"
);
const OpcoesDoFormProvisao = use(
  "App/Models/Mysql/Patrocinios/OpcoesDoFormProvisao"
);
const GestaoDePatrocinios = use(
  "App/Models/Mysql/Patrocinios/GestaoDePatrocinios"
);
const GestaoOrcamentoPatrocinios = use(
  "App/Models/Mysql/Patrocinios/GestaoOrcamentoPatrocinios"
);
const GestaoPagamentosPatrocinios = use(
  "App/Models/Mysql/Patrocinios/GestaoPagamentosPatrocinios"
);
const GestaoProjetosPatrocinios = use(
  "App/Models/Mysql/Patrocinios/GestaoProjetosPatrocinios"
);
const GestaoProvisaoPatrocinios = use(
  "App/Models/Mysql/Patrocinios/GestaoProvisaoPatrocinios"
);
const GestaoTotal = use("App/Models/Mysql/Patrocinios/GestaoTotal");
const Solicitacao = use("App/Models/Mysql/Patrocinios/Solicitacao");

class GestaoDetalhePatrociniosRepository {
  async gestaoPatrocinio() {
    const dadosSolcitacoes = await GestaoDePatrocinios.all();

    const solicitacoes = dadosSolcitacoes ? dadosSolcitacoes.toJSON() : [];

    return solicitacoes;
  }

  async patchEditaGestao(detalheGestao) {
    const editaGestao = await GestaoDePatrocinios.query()
      .where("idSolicitacao", parseInt(detalheGestao.idSolicitacao))
      .first();
    editaGestao.idSolicitacao = detalheGestao.idSolicitacao;
    editaGestao.dataSac = detalheGestao.dataSac;
    editaGestao.notaTecnicaAssinada = detalheGestao.notaTecnicaAssinada;
    editaGestao.idSituacaoProjeto = detalheGestao.idSituacaoProjeto;
    editaGestao.idSituacaoProvisao = detalheGestao.idSituacaoProvisao;
    editaGestao.publicoProjeto = detalheGestao.publicoProjeto;

    await editaGestao.save();
  }

  async getOpcoesFormGestao() {
    const opcoesFormGestao = await OpcoesDoFormGestao.all();

    const opcoes = opcoesFormGestao ? opcoesFormGestao.toJSON() : [];

    return opcoes;
  }

  async getOpcoesFormProvisao() {
    const opcoesFormProvisao = await OpcoesDoFormProvisao.all();

    const opcoes = opcoesFormProvisao ? opcoesFormProvisao.toJSON() : [];

    return opcoes;
  }

  async gravarDetalheGestaoDePatrocinios(detalheGestao) {
    await detalheGestao.save();

    return detalheGestao;
  }

  async gravarOrcamento(detalheOrcamento) {
    await detalheOrcamento.save();

    return detalheOrcamento;
  }

  async patchOrcamento(detalheOrcamento) {
    const editarOrcamento = await GestaoOrcamentoPatrocinios.query()
      .where("id", parseInt(detalheOrcamento.id))
      .first();
    editarOrcamento.prefixoOrigem = detalheOrcamento.prefixoOrigem;
    editarOrcamento.nomePrefixoOrigem = detalheOrcamento.nomePrefixoOrigem;
    editarOrcamento.incluidoOrcMkt = detalheOrcamento.incluidoOrcMkt;
    editarOrcamento.valorOrcamento = detalheOrcamento.valorOrcamento;
    editarOrcamento.observacao = detalheOrcamento.observacao;

    await editarOrcamento.save();
  }

  async deleteOrcamento(idDetalheOrcamento) {
    const excluiOrcamento = await GestaoOrcamentoPatrocinios.query()
      .where("id", parseInt(idDetalheOrcamento))
      .update({ ativo: "0" });

    return excluiOrcamento;
  }

  async gravarProvisao(detalheProvisao) {
    await detalheProvisao.save();

    return detalheProvisao;
  }

  async patchProvisao(detalheProvisao) {
    const editaProvisao = await GestaoProvisaoPatrocinios.query()
      .where("id", parseInt(detalheProvisao.id))
      .first();
    editaProvisao.competenciaProvisao = detalheProvisao.competenciaProvisao;
    editaProvisao.valorProvisao = detalheProvisao.valorProvisao;
    editaProvisao.observacao = detalheProvisao.observacao;

    await editaProvisao.save();
  }

  async deleteProvisao(idDetalheProvisao) {
    const excluiProvisao = await GestaoProvisaoPatrocinios.query()
      .where("id", parseInt(idDetalheProvisao))
      .update({ ativo: "0" });

    return excluiProvisao;
  }

  async gravarPagamento(detalhePagamento) {
    await detalhePagamento.save();

    return detalhePagamento;
  }

  async patchPagamento(detalhePagamento) {
    const editaPagamento = await GestaoPagamentosPatrocinios.query()
      .where("id", detalhePagamento.id)
      .first();
    editaPagamento.dataDoPagamento = detalhePagamento.dataDoPagamento;
    editaPagamento.valorPagamento = detalhePagamento.valorPagamento;
    editaPagamento.observacao = detalhePagamento.observacao;

    await editaPagamento.save();
  }

  async deletePagamento(idDetalhePagamento) {
    const excluiPagamento = await GestaoPagamentosPatrocinios.query()
      .where("id", parseInt(idDetalhePagamento))
      .update({ ativo: "0" });

    return excluiPagamento;
  }

  async getSolicitacaoById(id) {
    const consulta = await Solicitacao.query()
      .select("nomeEvento")
      .where("id", id)
      .first();

    const nomeEvento = consulta ? consulta.toJSON() : { nomeEvento: "" };

    return nomeEvento.nomeEvento;
  }

  async getPagamentos(id) {
    const gestaoPagamentosPatrocinios =
      await GestaoPagamentosPatrocinios.query()
        .where("idProjeto", id)
        .where("ativo", "1")
        .orderBy("updatedAt", "desc")
        .fetch();

    const busca = gestaoPagamentosPatrocinios
      ? gestaoPagamentosPatrocinios.toJSON()
      : [];

    return busca;
  }

  async getProjetos() {
    const gestaoProjetosPatrocinios = await GestaoProjetosPatrocinios.all();

    const busca = gestaoProjetosPatrocinios
      ? gestaoProjetosPatrocinios.toJSON()
      : [];

    return busca;
  }

  async getProvisao(id) {
    const gestaoProvisaoPatrocinios = await GestaoProvisaoPatrocinios.query()
      .where("idProjeto", id)
      .where("ativo", "1")
      .orderBy("updatedAt", "desc")
      .fetch();

    const busca = gestaoProvisaoPatrocinios
      ? gestaoProvisaoPatrocinios.toJSON()
      : [];

    return busca;
  }

  async getOrcamento(id) {
    const gestaoOrcamentoPatrocinios = await GestaoOrcamentoPatrocinios.query()
      .where("idProjeto", id)
      .where("ativo", "1")
      .orderBy("updatedAt", "desc")
      .fetch();

    const busca = gestaoOrcamentoPatrocinios
      ? gestaoOrcamentoPatrocinios.toJSON()
      : [];

    return busca;
  }

  async getOrcamentoById(id) {
    const gestaoOrcamentoPatrocinios =
      await GestaoOrcamentoPatrocinios.query().fetch();

    const busca = gestaoOrcamentoPatrocinios
      ? gestaoOrcamentoPatrocinios.toJSON()
      : [];

    return busca;
  }

  async getGestaoTotal(id) {
    const dadosGestaoPatrocinios = await GestaoTotal.query()
      .where("idSolicitacao", id)
      .orderBy("updatedAt", "desc")
      .fetch();

    const dadosDaGestaoTotal = dadosGestaoPatrocinios
      ? dadosGestaoPatrocinios.toJSON()
      : [];

    return dadosDaGestaoTotal;
  }
}

module.exports = GestaoDetalhePatrociniosRepository;
