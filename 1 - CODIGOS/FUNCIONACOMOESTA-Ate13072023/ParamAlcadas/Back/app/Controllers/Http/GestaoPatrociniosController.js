"use strict";

const GestaoDetalhePatrociniosRepository = use("App/Commons/Patrocinios/Repositories/GestaoDetalhePatrociniosRepository");
const GravarGestaoDetalhePatrocinioFactory = use("App/Commons/Patrocinios/ModelFactory/GravarGestaoDetalhePatrocinioFactory");
const GravarOrcamentoDetalhePatrocinioFactory = use("App/Commons/Patrocinios/ModelFactory/GravarOrcamentoDetalhePatrocinioFactory");
const GravarPagamentoPatrocinioFactory = use("App/Commons/Patrocinios/ModelFactory/GravarPagamentoPatrocinioFactory");
const GravarProvisaoPatrocinioFactory = use("App/Commons/Patrocinios/ModelFactory/GravarProvisaoPatrocinioFactory");
const UCGestaoDetalhePatrociniosGravar = use("App/Commons/Patrocinios/UseCases/UCGestaoDetalhePatrociniosGravar");
const UCGestaoPatrociniosOpcoes = use("App/Commons/Patrocinios/UseCases/UCGestaoPatrociniosOpcoes");
const UCGestaoPatrocinioEditar = use("App/Commons/Patrocinios/UseCases/UCGestaoPatrocinioEditar");
const UCGestaoTotalBusca = use("App/Commons/Patrocinios/UseCases/UCGestaoTotalBusca");
const UCOrcamentoPatrociniosBusca = use("App/Commons/Patrocinios/UseCases/UCOrcamentoPatrociniosBusca");
const UCOrcamentoPatrociniosBuscaById = use("App/Commons/Patrocinios/UseCases/UCOrcamentoPatrociniosBuscaById");
const UCOrcamentoPatrocinioEditar = use("App/Commons/Patrocinios/UseCases/UCOrcamentoPatrocinioEditar");
const UCOrcamentoPatrocinioGravar = use("App/Commons/Patrocinios/UseCases/UCOrcamentoPatrocinioGravar");
const UCPagamentoPatrocinioGravar = use("App/Commons/Patrocinios/UseCases/UCPagamentoPatrocinioGravar");
const UCPagamentosPatrociniosBusca =  use("App/Commons/Patrocinios/UseCases/UCPagamentosPatrociniosBusca");
const UCPagamentoPatrocinioEditar = use("App/Commons/Patrocinios/UseCases/UCPagamentoPatrocinioEditar");
const UCProjetosPatrociniosBusca = use("App/Commons/Patrocinios/UseCases/UCProjetosPatrociniosBusca");
const UCProvisaoPatrociniosBusca = use("App/Commons/Patrocinios/UseCases/UCProvisaoPatrociniosBusca");
const UCProvisaoPatrocinioGravar = use("App/Commons/Patrocinios/UseCases/UCProvisaoPatrocinioGravar");
const UCProvisaoPatrocinioEditar = use("App/Commons/Patrocinios/UseCases/UCProvisaoPatrocinioEditar");
const UCProvisaoPatrocinioExcluir = use("App/Commons/Patrocinios/UseCases/UCProvisaoPatrocinioExcluir");
const UCPagamentoPatrocinioExcluir = use("App/Commons/Patrocinios/UseCases/UCPagamentoPatrocinioExcluir");
const UCOrcamentoPatrocinioExcluir = use("App/Commons/Patrocinios/UseCases/UCOrcamentoPatrocinioExcluir");

class GestaoPatrociniosController {

  async getOpcoesFormGestao({ response, request }) {
  const { id } = request.allParams();
  const ucGestaoPatrociniosOpcoes = new UCGestaoPatrociniosOpcoes(new GestaoDetalhePatrociniosRepository());
  await ucGestaoPatrociniosOpcoes.validate(parseInt(id));
  const listaOpcoes = await ucGestaoPatrociniosOpcoes.run();
    
  response.ok(listaOpcoes);

  }

  async gravarGestao({ request, response, session }) {
    const {dataGestao} = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucGestaoDetalhePatrociniosGravar = new UCGestaoDetalhePatrociniosGravar(new GestaoDetalhePatrociniosRepository(), new GravarGestaoDetalhePatrocinioFactory());
    await ucGestaoDetalhePatrociniosGravar.validate(usuario, dataGestao);
    const gravado = await ucGestaoDetalhePatrociniosGravar.run();
    
    response.ok(gravado);
  }

  async patchEditaGestao({request, response}){
    const dadosGestao = request.allParams();
    const ucGestaoPatrocinioEditar = new UCGestaoPatrocinioEditar(new GestaoDetalhePatrociniosRepository());
    await ucGestaoPatrocinioEditar.validate(dadosGestao);
    const editaGestao = await ucGestaoPatrocinioEditar.run();

    response.ok(editaGestao);
  }
  
  async gravarOrcamento({ request, response, session }) {
    const {dataOrcamento} = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucOrcamentoPatrocinioGravar = new UCOrcamentoPatrocinioGravar(new GestaoDetalhePatrociniosRepository(), new GravarOrcamentoDetalhePatrocinioFactory());
    await ucOrcamentoPatrocinioGravar.validate(usuario, dataOrcamento);
    const orcamentoGravado = await ucOrcamentoPatrocinioGravar.run();
    
    response.ok(orcamentoGravado);
  }

  async getOrcamento({ response, request}){
    const { id } = request.allParams();
    const ucOrcamentoPatrociniosBusca = new UCOrcamentoPatrociniosBusca(new GestaoDetalhePatrociniosRepository());
    await ucOrcamentoPatrociniosBusca.validate(id);
    const listaOrcamento = await ucOrcamentoPatrociniosBusca.run();

    response.ok(listaOrcamento);
  }

  async patchOrcamento({request, response}){
    const dadosOrcamento = request.allParams();
    const ucOrcamentoPatrocinioEditar = new UCOrcamentoPatrocinioEditar(new GestaoDetalhePatrociniosRepository());
    await ucOrcamentoPatrocinioEditar.validate(dadosOrcamento);
    const editaOrcamento = await ucOrcamentoPatrocinioEditar.run();

    response.ok(editaOrcamento);
  }

  async deleteOrcamento({request, response}){
    const {id: idDataOrcamento} = request.allParams();
    const ucOrcamentoPatrocinioExcluir = new UCOrcamentoPatrocinioExcluir(new GestaoDetalhePatrociniosRepository());
    await ucOrcamentoPatrocinioExcluir.validate(idDataOrcamento);
    const excluiOrcamento = await ucOrcamentoPatrocinioExcluir.run();

    response.ok(excluiOrcamento);
  }
  
  async gravarProvisao({ request, response, session }) {
    const {dataProvisao} = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucProvisaoPatrocinioGravar = new UCProvisaoPatrocinioGravar(new GestaoDetalhePatrociniosRepository(), new GravarProvisaoPatrocinioFactory());
    await ucProvisaoPatrocinioGravar.validate(usuario, dataProvisao);
    const gravaProvisao = await ucProvisaoPatrocinioGravar.run();
    
    response.ok(gravaProvisao);
  }

  async getProvisao({ response, request}){
    const { id } = request.allParams();
    const ucProvisaoPatrociniosBusca = new UCProvisaoPatrociniosBusca(new GestaoDetalhePatrociniosRepository());
    await ucProvisaoPatrociniosBusca.validate(id);
    const listaProvisao = await ucProvisaoPatrociniosBusca.run();
    
    response.ok(listaProvisao);
  }

  async patchProvisao({request, response}){
    const dadosProvisao = request.allParams();
    const ucProvisaoPatrocinioEditar = new UCProvisaoPatrocinioEditar(new GestaoDetalhePatrociniosRepository());
    await ucProvisaoPatrocinioEditar.validate(dadosProvisao);
    const editaProvisao = await ucProvisaoPatrocinioEditar.run();

    response.ok(editaProvisao);
  }

  async deleteProvisao({request, response}){
    const {id: idDataProvisao} = request.allParams();
    const ucProvisaoPatrocinioExcluir = new UCProvisaoPatrocinioExcluir(new GestaoDetalhePatrociniosRepository());
    await ucProvisaoPatrocinioExcluir.validate(idDataProvisao);
    const excluiProvisao = await ucProvisaoPatrocinioExcluir.run();

    response.ok(excluiProvisao);
  }

  async gravarPagamento({ request, response, session }) {
    const dataPagamento = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucPagamentoPatrocinioGravar = new UCPagamentoPatrocinioGravar(new GestaoDetalhePatrociniosRepository(), new GravarPagamentoPatrocinioFactory());
    await ucPagamentoPatrocinioGravar.validate(usuario, dataPagamento);
    const pagamentoGravado = await ucPagamentoPatrocinioGravar.run();
    
    response.ok(pagamentoGravado);
  }

  async getPagamentos({ response, request}){
    const { id } = request.allParams();
    const ucPagamentosPatrociniosBusca = new UCPagamentosPatrociniosBusca(new GestaoDetalhePatrociniosRepository());
    await ucPagamentosPatrociniosBusca.validate(id);
    const listaPagamentos = await ucPagamentosPatrociniosBusca.run();
    
    response.ok(listaPagamentos);
  }

  async patchPagamento({request, response}){
    const dadosPagamento = request.allParams();
    const ucPagamentoPatrocinioEditar = new UCPagamentoPatrocinioEditar(new GestaoDetalhePatrociniosRepository());
    await ucPagamentoPatrocinioEditar.validate(dadosPagamento);
    const editaPagamento = await ucPagamentoPatrocinioEditar.run();

    response.ok(editaPagamento);
  }

  async deletePagamento({request, response}){
    const {id: idDataPagamento} = request.allParams();
    const ucPagamentoPatrocinioExcluir = new UCPagamentoPatrocinioExcluir(new GestaoDetalhePatrociniosRepository());
    await ucPagamentoPatrocinioExcluir.validate(idDataPagamento);
    const excluiPagamento = await ucPagamentoPatrocinioExcluir.run();

    response.ok(excluiPagamento);
  }
  
  async getProjetos({ response, request}){
    const { id, idSolicitacao } = request.allParams();
    const ucProjetosPatrociniosBusca = new UCProjetosPatrociniosBusca(new GestaoDetalhePatrociniosRepository());
    await ucProjetosPatrociniosBusca.validate(id, idSolicitacao);
    const listaProjetos = await ucProjetosPatrociniosBusca.run();
    
    response.ok(listaProjetos);
  }
  
  async getOrcamentoById({ response, request}){
    const { id } = request.allParams();
    const ucOrcamentoPatrociniosBuscaById = new UCOrcamentoPatrociniosBuscaById(new GestaoDetalhePatrociniosRepository());
    await ucOrcamentoPatrociniosBuscaById.validate(id);
    const listaOrcamentoById = await ucOrcamentoPatrociniosBuscaById.run();

    response.ok(listaOrcamentoById);
  }

  async getGestaoTotal({response, request}) {
    const { idSolicitacao } = request.allParams();
    const ucGestaoTotalBusca = new UCGestaoTotalBusca(new GestaoDetalhePatrociniosRepository());
    await ucGestaoTotalBusca.validate(idSolicitacao);
    const listaBuscaTotal = await ucGestaoTotalBusca.run();
    
    response.ok(listaBuscaTotal);
  }

  
}

module.exports = GestaoPatrociniosController;
