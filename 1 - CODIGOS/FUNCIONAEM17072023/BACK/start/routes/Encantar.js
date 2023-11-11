/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

const NOME_FERRAMENTA = "Encantar";

Route.group(() => {
  Route.get(
    "/solicitacoes-andamento/",
    "Encantar/SolicitacoesController.getSolicitacoesAndamento"
  );

  Route.get(
    "/solicitacoes-meu-prefixo/",
    "Encantar/SolicitacoesController.getSolicitacoesMeuPrefixo"
  );

  Route.get(
    "/solicitacoes-finalizadas/",
    "Encantar/SolicitacoesController.getSolicitacoesFinalizadas"
  );

  Route.get(
    "/estoques/:prefixoFato",
    "Encantar/SolicitacoesController.getEstoquesPorPrefixo"
  );

  Route.get(
    "/capacitacao/verifica-capacitacao",
    "Encantar/SolicitacoesController.verificaCapacitacao"
  );
  Route.get("/produtosBB", "Encantar/SolicitacoesController.getProdutosBB");
  Route.get("/brindes/", "Encantar/EstoqueController.brindesPorPrefixo");
  Route.post(
    "/solicitacao",
    "Encantar/SolicitacoesController.salvarSolicitacao"
  );

  Route.post(
    "/capacitacao/visualizou-video/:idVideo",
    "Encantar/SolicitacoesController.visualizouVideo"
  ).middleware(["validaIdVideo", "checaVisualizouVideo"]);

  //catalogo
  Route.get(
    "/catalogo/brindes",
    "Encantar/CatalogoController.findAllBrindes"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_CATALOGO"]);
  Route.get(
    "/catalogo/brindes/:id",
    "Encantar/CatalogoController.findBrinde"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_CATALOGO"]);
  Route.post(
    "/catalogo/remover-brinde",
    "Encantar/CatalogoController.deleteBrinde"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_CATALOGO"]);
  Route.post(
    "/catalogo/salvar-brinde",
    "Encantar/CatalogoController.storeBrinde"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_CATALOGO"]);

  //Brindes
  //TODO - mover metodo para o EstoqueController, pois a entidade brinde não existe
  //isoladamente.
  Route.get(
    "brindes-por-gestor/",
    "Encantar/SolicitacoesController.getBrindesPorGestor"
  );

  //estoque
  Route.get(
    "/estoque/get-brindes-prefixo",
    "Encantar/EstoqueController.brindesPorPrefixo"
  ).middleware(["estoqueManager"]);
  Route.post(
    "/estoque/mudar-status-brinde",
    "Encantar/EstoqueController.mudarStatusBrinde"
  ).middleware(["estoqueManager"]);
  Route.post(
    "/estoque/remover-brinde",
    "Encantar/EstoqueController.removerBrindeEstoque"
  ).middleware(["estoqueManager"]);
  Route.post(
    "/estoque/alterar-valor-estoque",
    "Encantar/EstoqueController.alterarQuantidadeEstoque"
  ).middleware(["estoqueManager"]);
  Route.post(
    "/estoque/incluir-brindes-estoque",
    "Encantar/EstoqueController.incluirBrindesEstoque"
  ).middleware(["estoqueManager"]);
  Route.get(
    "/estoque/detentores-estoque",
    "Encantar/EstoqueController.getDetentoresEstoque"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_DETENTORES_ESTOQUE"]);
  Route.post(
    "/estoque/salvar-detentor-estoque",
    "Encantar/EstoqueController.createDetentorEstoque"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_DETENTORES_ESTOQUE"]);
  Route.post(
    "/estoque/remover-detentor-estoque",
    "Encantar/EstoqueController.deleteDetentorEstoque"
  ).middleware(["allowed:AND,Encantar,GERENCIAR_DETENTORES_ESTOQUE"]);

  Route.get(
    "/download-anexo/:idAnexo",
    "Encantar/SolicitacoesController.downloadAnexo"
  );
})
  .prefix("/encantar")
  .middleware(["isTokenValid", `routeLogger:${NOME_FERRAMENTA}`]);

// SOLICITAÇÕES
const SOLICITACOES_CONTROLLER = `Encantar/SolicitacoesController`;

Route.group(() => {
  Route.get(
    "/estoques/:prefixoFato",
    `${SOLICITACOES_CONTROLLER}.getEstoquesPorPrefixo`
  );
  Route.get(
    "/verifica-capacitacao",
    `${SOLICITACOES_CONTROLLER}.verificaCapacitacao`
  );
  Route.get(
    "/pode-incluir",
    `${SOLICITACOES_CONTROLLER}.podeIncluirSolicitacao`
  );

  Route.get(
    "/pendencias-aprovacao/:tipoPendencia",
    `${SOLICITACOES_CONTROLLER}.getPendenciasAprovacao`
  ).middleware(["validarTipoPendenciaAprovacao"]);

  Route.get(
    "/aprovacoes-finalizada/",
    `${SOLICITACOES_CONTROLLER}.getAprovacoesFinalizadas`
  ).middleware(["validarAprovacoesFinalizadas"]);

  Route.get(
    "/aprovacao/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.solicitacaoParaAprovar`
  ).middleware(["podeAcessarAprovacaoDaSolicitacao"]);

  Route.post(
    "/avanca-fluxo/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.avancarFluxo`
  );

  Route.get("/produtosBB", `${SOLICITACOES_CONTROLLER}.getProdutosBB`);
  Route.get(
    "/dados-cliente/:mci",
    `${SOLICITACOES_CONTROLLER}.getDadosClienteParaSolicitacao`
  ).middleware(["validarMCI"]);

  Route.get(
    "pendentes-para-envio/",
    `${SOLICITACOES_CONTROLLER}.getSolicitacoesPendentesParaEnvio`
  );

  Route.get(
    "pendentes-para-reacao/",
    `${SOLICITACOES_CONTROLLER}.getSolicitacoesParaReacao`
  ).middleware(["parseFiltrosSolicitacoesParaReacao"]);

  Route.get(
    "reacao/minhas-solicitacoes/",
    `${SOLICITACOES_CONTROLLER}.getMinhasSolicitacoesParaReacao`
  ).middleware(["parseParamsMinhasSolicitacoes"]);

  Route.post(
    "reacao/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.salvarReacao`
  ).middleware(["parseRegistroReacao"]);

  Route.get(
    "pendentes-para-entrega/",
    `${SOLICITACOES_CONTROLLER}.getSolicitacoesPendentesEntregaCliente`
  );

  Route.get(
    "pendentes-recebimento-prefixo/",
    `${SOLICITACOES_CONTROLLER}.getSolicitacoesPendentesParaRecebimentoPrefixo`
  );

  Route.get(
    "devolvidas/",
    `${SOLICITACOES_CONTROLLER}.getSolicitacoesDevolvidas`
  );

  Route.post(
    "tratar-devolucao/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.tratarDevolucao`
  );

  Route.get(
    "status-solicitacoes",
    `${SOLICITACOES_CONTROLLER}.getStatusSolicitacoesList`
  );

  Route.post(
    "cancelar/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.cancelarSolicitacao`
  ).middleware(["podeCancelarSolicitacao"]);

  Route.post(
    "alterar-texto-carta",
    `${SOLICITACOES_CONTROLLER}.alterarTextoCarta`
  ).middleware(["podeAlterarCarta"]);

  Route.post(
    "/registrar-envio/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.registrarEnvio`
  );

  Route.post(
    "/registrar-falha-envio/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.registrarFalhaEnvio`
  );

  Route.post(
    "/registrar-recebimento-prefixo/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.registrarRecebimentoPrefixo`
  );
  Route.post(
    "/registrar-entrega-cliente/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.registrarEntregaCliente`
  );

  Route.post(
    "/entrega/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.editarLocalEntrega`
  );
  Route.post("/", `${SOLICITACOES_CONTROLLER}.salvarSolicitacao`);
  Route.post(
    "/capacitacao/visualizou-video/:idVideo",
    `${SOLICITACOES_CONTROLLER}.visualizouVideo`
  ).middleware(["validaIdVideo", "checaVisualizouVideo"]);
  Route.get("por-cliente/:mci", `${SOLICITACOES_CONTROLLER}.getPorCliente`);
  Route.get(
    "/validar-existencia/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.verificarSolicitacaoParaRacao`
  );
  Route.get("/perm-reacao", `${SOLICITACOES_CONTROLLER}.getPermRegistroReacao`);
  Route.get(
    "/perm-incluir-solicitacao",
    `${SOLICITACOES_CONTROLLER}.getPermIncluirSolicitacao`
  );
  Route.get(
    "/para-reacao/:idSolicitacao",
    `${SOLICITACOES_CONTROLLER}.getSolicitacao`
  ).middleware(["podeRegistrarReacao"]);

  Route.get("/:idSolicitacao", `${SOLICITACOES_CONTROLLER}.getSolicitacao`);
})
  .prefix("/encantar/solicitacao")
  .middleware(["isTokenValid", `routeLogger:${NOME_FERRAMENTA}`]);
