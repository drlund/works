/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const DEMANDAS_COMMON_MIDDLEWARE = ['isTokenValid'];
const DEMANDAS_MANAGER_MIDDLEWARE = [ ...DEMANDAS_COMMON_MIDDLEWARE, 'isManagerDemandas', 'isUserColaborador' ];

Route.post('/demandas', 'DemandaController.create').middleware([...DEMANDAS_COMMON_MIDDLEWARE, 'isManagerDemandas' ]);
Route.patch('/demandas', 'DemandaController.update').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.patch('/demandas/arquivar/:id', 'DemandaController.arquivar').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.patch('/demandas/reativar/:id', 'DemandaController.reativar').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.post('/demandas/duplicar/:id', 'DemandaController.duplicar').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.get('/demandas/adm', 'DemandaController.findAdm').middleware([...DEMANDAS_COMMON_MIDDLEWARE, 'isManagerDemandas' ]);
Route.get('/demandas/responder/pendentes', 'DemandaController.findPendentesResposta').middleware([...DEMANDAS_COMMON_MIDDLEWARE  ]);
Route.get('/demandas/responder/respondidas', 'DemandaController.findRespondidas').middleware([...DEMANDAS_COMMON_MIDDLEWARE  ]);
Route.get('/demandas/respostas-anteriores/:idDemanda', 'DemandaController.findRespostasAnteriores').middleware(['isPublicoAlvo',...DEMANDAS_COMMON_MIDDLEWARE,   ]);
Route.get('/demandas/respostas/csv', 'DemandaController.getRespostasCsv').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.get('/demandas/respostas/:idDemanda', 'DemandaController.findResponse').middleware([...DEMANDAS_COMMON_MIDDLEWARE  ]);
Route.post('/demandas/respostas/:idDemanda', 'DemandaController.registerResponse').middleware([...DEMANDAS_COMMON_MIDDLEWARE  ]);
Route.post('/demandas/respostas/rascunho/:idDemanda', 'DemandaController.saveResponseDraft').middleware([...DEMANDAS_COMMON_MIDDLEWARE ]);
Route.post('/demandas/respostas/excluir/:idDemanda', 'DemandaController.removeResponse').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.post('/demandas/respostas/excluir-ocorrencia/:idDemanda', 'DemandaController.removeOccurrence').middleware([...DEMANDAS_COMMON_MIDDLEWARE, 'isPublicoAlvo' ]);
Route.post('/demandas/notificacoes/convites/:idDemanda', 'DemandaController.sendInvitationsEmails').middleware([...DEMANDAS_MANAGER_MIDDLEWARE  ]);
Route.post('/demandas/notificacoes/lembretes/:idDemanda', 'DemandaController.sendRemindersEmails').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.get('/demandas/estatisticas/respostas/:idDemanda', 'DemandaController.getEstatisticasDemanda').middleware([...DEMANDAS_MANAGER_MIDDLEWARE  ]);
Route.get('/demandas/notificacoes/historico/:idDemanda', 'DemandaController.getHistoricoNotificacoes').middleware([...DEMANDAS_MANAGER_MIDDLEWARE  ]);
Route.get('/demandas/status/notificacoes/:idDemanda', 'DemandaController.getStatusNotificacoes').middleware([...DEMANDAS_MANAGER_MIDDLEWARE  ]);
Route.get('/demandas/responder/:idDemanda', 'DemandaController.findPerguntasResponder').middleware([...DEMANDAS_COMMON_MIDDLEWARE, 'isPublicoAlvo' ]);
Route.get('/demandas/publicoalvo/csv', 'DemandaController.getPublicoAlvoCsv').middleware([...DEMANDAS_MANAGER_MIDDLEWARE ]);
Route.get('/demandas/publicoalvo/paginate/:idDemanda', 'DemandaController.findPublicoAlvoPaginate').middleware([...DEMANDAS_MANAGER_MIDDLEWARE  ]);
Route.get('/demandas/:id', 'DemandaController.find').middleware([...DEMANDAS_COMMON_MIDDLEWARE, 'isManagerDemandas' ]);

//rotas para uso automatizado via api-key
Route.group(() => {
/**
 * Parâmetros desta rota:
 * idDemanda (obrigatorio)
 * apiKey (obrigatorio) - chave de api valida cadastrada
 * apenasFinalizadas (opcional) - indica se deve baixas apenas as respostas finalizadas se
 *                                a demanda for do tipo lista no publico alvo. (valor: true)
 * outputFormat (opcional): "xls" (default) ou "csv"
 * delimiter (opcional): qualquer sequência de caracteres, ";" (default)
 */ 
 Route.get('automation/respostas-csv', 'DemandaController.getRespostasCsv');

}).prefix("/demandas").middleware(["isApiKeyValid:Demandas"]);