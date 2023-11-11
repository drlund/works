"use strict";
// 
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
/** @type /** @type {import('@adonisjs/lucid/src/Database')} */
const { mtnConsts, mtnStatus, acoes } = use("Constants");
const { pgSchema } = mtnConsts;
const moment = use('App/Commons/MomentZone');

/*
|--------------------------------------------------------------------------
| MtnSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/




Factory.blueprint("App/Models/Postgres/MtnTiposAcao", async (faker, i, data) => {
  return {
    id: data.id,
    tipo: data.tipo,
    display_text: data.display_text,
  };
});

Factory.blueprint("App/Models/Postgres/MtnStatus", async (faker, i, data) => {
  return {
    medida: data.medida,
    descricao: data.descricao,
  };
});

Factory.blueprint("App/Models/Postgres/MtnMedida", async (faker, i, data) => {
  return {
    ativa: true,
    txt_medida: data.txt_medida
  };
});

class MtnSeeder {
  async run() {
    
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 1, tipo: "CRIACAO", display_text: "Criação do MTN"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 2, tipo: "SOLICITA_ESCLARECIMENTO", display_text: "Solicitação de Esclarecimento"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 3, tipo: "RESPONDE_ESCLARECIMENTO", display_text: "Respondeu esclarecimento"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 4, tipo: "FINALIZAR_ANALISE", display_text: "Finalizou a análise"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 5, tipo: "SALVAR_PARECER", display_text: "Salvou texto do parecer"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({id: 6, tipo: "SALVAR_PARECER_RECURSO", display_text: "Registrou análise. Aguardando recurso."});

    await Factory.model("App/Models/Postgres/MtnStatus").create({id: 1, medida: "A_ANALISAR", descricao: "MTN a analisar"});
    await Factory.model("App/Models/Postgres/MtnStatus").create({id: 2, medida: "EM_ANALISE", descricao: "Pendente parecer da Super ADM"});
    await Factory.model("App/Models/Postgres/MtnStatus").create({id: 4, medida: "FINALIZADO", descricao: "Análise finalizada"});
    
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 1, txt_medida: "Orientações", cabe_recurso: false });
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 2, txt_medida: "Irregularidade não caracterizada", cabe_recurso: false });
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 3, txt_medida: "Alerta ético negocial", cabe_recurso: true });
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 4, txt_medida: "Gedip", cabe_recurso: false });
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 5, txt_medida: "Indevido", cabe_recurso: false });
    await Factory.model("App/Models/Postgres/MtnMedida").create({ id: 6, txt_medida: "Não alcançado", cabe_recurso: false });

  }
}

module.exports = MtnSeeder;
