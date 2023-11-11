'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

/**  Main Routes  */
Route.get('/', () => { return { greeting: 'Hello world in JSON' } });

// ARH
require('./routes/Arh');

// ARH
require('./routes/Mestre');

//Elogios
require('./routes/Elogios');

//Acessos
require('./routes/Acessos');

//Demandas
require('./routes/Demandas');

// Controle Disciplinar
require('./routes/CtrlDisciplinar');

//Bacen Procedentes
require('./routes/BacenProcedentes');

//MTN
require('./routes/Mtn');
// === MTN ===

// == Ordem de Serviço ==
require('./routes/OrdemServ');

// === INC - Instrucoes Normativas Corporativa ===
require('./routes/INC');

// Coban
require('./routes/Coban');
//  === Coban ===

// Designação Interina
require('./routes/Designacao');

// Patrocinios
require('./routes/Patrocinios');

// Encantar
require('./routes/Encantar');

//Tarifas
require('./routes/Tarifas');

// Clientes
require('./routes/Clientes');

// Autoridades Secex
require('./routes/AutoridadesSecex');
//  === Autoridades Secex ===

// Images Server
require('./routes/Imagens');

// Hora Extra
require('./routes/HorasExtras');

// Chaves de Apis
require('./routes/ChavesApi');

// Projetos Infor
require('./routes/Projetos');

// Procurações
require('./routes/Procuracao');

// Ambiencia
require('./routes/Ambiencia');

// Carrossel de Notícias
require('./routes/Carrossel');

// Painel Gestor
require('./routes/PainelGestor');

// Movimentacoes
require('./routes/Movimentacoes');

// Flexibilização de Critérios
require('./routes/FlexCriterios');
// Podcasts
require('./routes/Podcasts');
