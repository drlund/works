"use strict";

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
/** @type /** @type {import('@adonisjs/lucid/src/Database')} */
const { mtnConsts } = use("Constants");
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

const matriculas = [
  "F0742889",
  "F0742888",
  "F1444789",
  "F3314437",
  "F2350107",
  "F2241479",
  "F8501698",
  "F3877335",
  "F3800948",
  "F4599189",
  "F5557419",
  "F6793369",
  "F7109433",
  "F7317399",
  "F8114939",
  "F0780178",
  "F6783855",
  "F9457834",
  "F1916251",
  "F2190133",
  "F3605962",
  "F6203949",
  "F8351033",
  "F8713123",
  "F0634219",
  "F1997527",
  "F6173292",
  "F6345936",
  "F7338954",
  "F8758950",
  "F9457946",
  "F9844438",
  "F1234154",
  "F2140697",
  "F3152285",
  "F5273100",
  "F5954021",
  "F6323524",
  "F6770784",
  "F6881179",
  "F8277879",
  "F9272245",
  "F0768119",
  "F1857558",
  "F2259168",
  "F3154890",
  "F3541379",
  "F3982331",
  "F4959819",
  "F6263706",
  "F6810329",
  "F6880519",
  "F7989309"
];

const matriculasAnalise = [
  { matricula: "F9128253", nome: "SHEILA MACHADO SILVERIO WASILEWSKI" },
  { matricula: "F3152425", nome: "FABIANA ALMEIDA NEPOMUCENO" },
  { matricula: "F9821730", nome: "WELLINGTON GUSTAVO MAXIMIANO BOND" },
  { matricula: "F6768256", nome: "MARCELO DE FRANCA VEIGA" }
];

const medidas = [
  { txt_medida: "Orientações" },
  { txt_medida: "Irregularidade funcional" },
  { txt_medida: "Não alcançado" },
  { txt_medida: "Alerta Ético Negocial" },
  { txt_medida: "Rito Ordinário" },
  { txt_medida: "Indevido" }
];

const visoes = [3, 5, 10, 18, 16, 20, 22];
const comissoes = [
  { codigo: "4382", nome: "CARGO_1" },
  { codigo: "4704", nome: "CARGO_2" },
  { codigo: "4660", nome: "CARGO_3" },
  { codigo: "7105", nome: "CARGO_4" },
  { codigo: "7104", nome: "CARGO_5" }
];

const prefixos = ["1606", "3598", "0001", "0227", "0224", "0317"];
const superComerciais = ["8798","8817","8399"];
const superNegociais = ["9007","8485","8494","9942"]
const unidadesEstrategicas = ["9270","9220"];

Factory.blueprint("App/Models/Postgres/Mtn", async (faker, i, data) => {
  let tempIndex = Math.floor(Math.random() * visoes.length);
  let id_visao = visoes[tempIndex];

  tempIndex = Math.floor(Math.random() * superComerciais.length);
  let prefixo_ocorrencia = prefixos[tempIndex];

  tempIndex = Math.floor(Math.random() * superComerciais.length);
  let prefixo_super_comercial = superComerciais[tempIndex];

  tempIndex = Math.floor(Math.random() * superNegociais.length);
  let prefixo_super_negocial = superNegociais[tempIndex];

  tempIndex = Math.floor(Math.random() * unidadesEstrategicas.length);
  let prefixo_unidade_estrategica = unidadesEstrategicas[tempIndex];

  return {
    nr_mtn: data.nr_mtn,
    id_visao,
    mci_associado: Math.floor(Math.random() * 1000000000).toString(),
    identificador_operacao: Math.floor(Math.random() * 1000000).toString(),
    prefixo_ocorrencia,
    nome_prefixo_ocorrencia: "Prefixo Exemplo",
    prefixo_super_comercial,
    nome_super_comercial: "Super Comercial Exemplo",
    prefixo_super_negocial,
    nome_super_negocial: "Super Negocial Exemplo",
    prefixo_unidade_estrategica,
    nome_unidade_estrategica: "Unidade estrategica Exemplo",
    id_status: data.id_status
  };
});

Factory.blueprint("App/Models/Postgres/MtnTiposAcao", async (faker, i, data) => {
  return {
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

Factory.blueprint(
  "App/Models/Postgres/MtnEnvolvido",
  async (faker, i, data) => {
    let tempIndexMat = Math.floor(Math.random() * matriculas.length);
    let tempIndexCargo = Math.floor(Math.random() * comissoes.length);
    let tempIndexPrefixo = Math.floor(Math.random() * prefixos.length);

    return {
      matricula: matriculas[tempIndexMat],
      nome_funci: faker.name(),
      resumo_orientacao: faker.sentence({ words: 2 }),
      desc_orientacao: faker.sentence({ words: 3 }),
      cd_cargo_epoca: comissoes[tempIndexCargo].codigo,
      nome_cargo_epoca: comissoes[tempIndexCargo].nome,
      cd_prefixo_epoca: prefixos[tempIndexPrefixo],
      nome_prefixo_epoca: faker.string({
        pool: "abcdefghijklmnopqrstuvxz",
        length: 10
      }),
      id_medida: data.id_medida,
      mat_resp_analise: data.mat_resp_analise,
      nome_resp_analise: data.nome_resp_analise,
      respondido_em: data.respondido_em ? data.respondido_em : null,
      txt_analise: data.txt_analise ? faker.paragraph({words: 3}) : null
    };
  }
);

class MtnSeeder {
  async run() {

    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({tipo: "CRIACAO", display_text: "Criação do MTN"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({tipo: "SOLICITA_ESCLARECIMENTO", display_text: "Solicitação de Esclarecimento"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({tipo: "RESPONDE_ESCLARECIMENTO", display_text: "Respondeu esclarecimento"});
    await Factory.model("App/Models/Postgres/MtnTiposAcao").create({tipo: "PARECER", display_text: "Registro de Parecer da Super ADM"});

    await Factory.model("App/Models/Postgres/MtnStatus").create({medida: "A_ANALISAR", descricao: "MTN a analisar"});
    await Factory.model("App/Models/Postgres/MtnStatus").create({medida: "PENDENTE_PARECER", descricao: "Pendente parecer da Super ADM"});
    await Factory.model("App/Models/Postgres/MtnStatus").create({medida: "PENDENTE_ENVOLVIDO", descricao: "Pendente de interação do envolvido"});
    await Factory.model("App/Models/Postgres/MtnStatus").create({medida: "FINALIZADO", descricao: "Análise finalizada"});

    for (let medida of medidas) {
      await Factory.model("App/Models/Postgres/MtnMedida").create(medida);
    }
    let arrayFinalizados = [];
    for (let i = 0; i < 20; i++) {
      //Gerando os Mtns
      const newMtn = {};
      newMtn.nr_mtn = "201912" + i.toString().padStart(5, "0");
      let id_status = "";
      if (i < 5) {
        id_status = 1;
      } else if (i < 15) {
        id_status = 2;
      } else {
        id_status = 3;
      }
      newMtn.id_status = id_status;



      const mtn = await Factory.model("App/Models/Postgres/Mtn").create({
        ...newMtn
      });
      let qtdEnvolvidos = Math.floor(Math.random() * 5);
      //Gerando os envolvidos
      for (let j = 0; j < qtdEnvolvidos; j++) {
        if (id_status === 1) {

          let tempIndexMat = Math.floor(Math.random() * matriculasAnalise.length);
          let tempIndexMedida = Math.floor(Math.random() * medidas.length);
          let daysAgo = Math.floor(Math.random() * 7); // Até quantos dias atrás serão geradas as respostas
          var envolvido = await Factory.model(
            "App/Models/Postgres/MtnEnvolvido"
          ).make({
            id_medida: tempIndexMedida + 1,
            mat_resp_analise: matriculasAnalise[tempIndexMat].matricula,
            nome_resp_analise: matriculasAnalise[tempIndexMat].nome,
            respondido_em: moment().subtract(daysAgo,'d').format('YYYY-MM-DD HH:MM'),
            txt_analise: true
          });
        }else{
          var envolvido = await Factory.model(
            "App/Models/Postgres/MtnEnvolvido"
          ).make();
        }

        await mtn.envolvidos().save(envolvido);                    
      }
    }
  }
}

module.exports = MtnSeeder;
