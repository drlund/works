export default {
  // status de pedido
  aguardandoManifestacao: 1,
  emAnalise: 2,
  aguardandoDeferimento: 3,
  cancelado: 4,
  finalizado: 5,
  aguardandoComplemento: 6,

  // filtros de solicitação
  minhasPendencias: 1,

  // manifestação ações
  acaoJustificativa: 1,
  acaoManifestacao: 2,
  acaoAnalise: 3,
  acaoDeferir: 5,
  acaoCancelar: 6,
  acaoFinalizar: 7,
  acaoDispensar: 8,
  acaoComplemento: 9,
  acaoAvocar: 10,

  // situações
  situacaoPendente: 1,
  situacaoRegistrada: 2,
  situacaoDispensada:3,
  situacaoNaoVigente:4,

  // parecer
  favoravel: '1',
  desfavoravel: '0',

  // dispensa
  dispensaAvocada: 4,
  dispensaEncerrado: 5,

  // etapas
  solicitar: 0,
  manifestar: 2,
  analisar: 3,
  despachar: 4,
  deferir: 5,
  finalizar: 6,
  encerrar: 7,
  detalhar: 8,

  // escalão deferidor
  comite: 1,
  administrador: 2,
  membroComite: 3,
  matricula: 4,

  // perfis de acesso
  perfilSolicitante: 'SOLICITANTE',
  perfilRoot: 'ROOT',
  perfilManifestante: 'MANIFESTANTE',
  perfilAnalista: 'ANALISTA',
  perfilDespachante: 'DESPACHANTE',
  perfilDeferidor: 'DEFERIDOR',
  perfilExecutante: 'EXECUTANTE',
};
