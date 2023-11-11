"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");
const { mtnConsts } = use("Constants");
const { pgSchema, mtnStatus } = mtnConsts;

const arrayStatus = [];

for (let key in mtnStatus) {
  arrayStatus.push(mtnStatus[key]);
}

class MtnSchema extends Schema {
  static get connection() {
    return "pgMtn";
  }

  up() {
    //Tabelas principais
    // this.create(`${pgSchema}.visoes`, table => {
    //   table.increments();
    //   table.integer("subtipo_visao");
    //   table.boolean("ativa").unsigned();
    //   table.string("origem_visao", 20); // Motivo pelo qual a visão foi criada
    //   table.string("desc_visao",255);
    //   table.string("orientacao_justificativa",45);
    //   table.timestamps(true,true);
    // });

    this.create(`${pgSchema}.status`, table => {
      table.increments();
      table.string("medida", 20);
      table.string("descricao", 45);
      table.timestamps(true, true);
    });

    this.create(`${pgSchema}.tipos_acao`, table => {
      table.increments();
      table.string("tipo");
      table.string("display_text", 45);
      table.timestamps(true, true);


    });

    this.create(`${pgSchema}.mtns`, table => {
      table.increments();
      table.string("nr_mtn", 15).unique();
      table.integer("id_visao").unsigned();
      table.integer("id_status").unsigned();
      table.text("desc_ocorrencia");
      table.string("mci_associado", 9);
      table.string("identificador_operacao");
      table.string("prefixo_ocorrencia", 4);
      table.string("nome_prefixo_ocorrencia", 45);
      table.string("prefixo_super_comercial", 4);
      table.string("nome_super_comercial", 45);
      table.string("prefixo_super_negocial", 4);
      table.string("nome_super_negocial", 45);
      table.string("prefixo_unidade_estrategica", 4);
      table.string("nome_unidade_estrategica", 45);

      table.timestamps(true, true);

      table
        .foreign("id_visao")
        .references("id")
        .inTable(`${pgSchema}.visoes`)
        .onDelete("cascade");

      table
        .foreign("id_status")
        .references("id")
        .inTable(`${pgSchema}.status`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.medidas`, table => {
      table.increments();
      table.boolean("ativa").unsigned();
      table.boolean("cabe_recurso").defaultTo(false);
      table.string("txt_medida", 255); // Motivo
      table.timestamps(true, true);
    });

    this.create(`${pgSchema}.envolvidos`, table => {
      table.increments();
      table.integer("id_mtn").unsigned();
      table.string("matricula", 8);
      table.string("nome_funci", 45);
      table.string("resumo_orientacao", 45);
      table.text("desc_orientacao");
      table.string("cd_cargo_epoca", 4);
      table.string("nome_cargo_epoca", 25);      
      table.string("cd_prefixo_epoca", 4);
      table.string("nome_prefixo_epoca", 25);
      table
        .integer("id_medida")
        .unsigned()
        .defaultTo(null);
      table
        .integer("id_medida_prevista")
        .unsigned()
        .defaultTo(null);
      table.datetime("respondido_em");
      table.string("mat_resp_analise", 8).defaultTo(null);
      table.string("nome_resp_analise", 45).defaultTo(null);
      table.text("txt_analise").defaultTo(null);

      table.timestamps(true, true);

      table
        .foreign("id_mtn")
        .references("id")
        .inTable(`${pgSchema}.mtns`)
        .onDelete("cascade");

      table
        .foreign("id_medida")
        .references("id")
        .inTable(`${pgSchema}.medidas`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.timeline`, table => {
      table.increments();
      table.integer("id_envolvido").unsigned();
      table.integer("id_acao").unsigned();
      table.string("mat_resp_acao", 8);
      table.string("nome_resp_acao", 50);
      table.string("prefixo_resp_acao", 4);
      table.string("nome_prefixo_resp_acao", 45);
      table.timestamps(true, true);

      table
        .foreign("id_envolvido")
        .references("id")
        .inTable(`${pgSchema}.envolvidos`)
        .onDelete("cascade");

      table
        .foreign("id_acao")
        .references("id")
        .inTable(`${pgSchema}.tipos_acao`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.esclarecimentos`, table => {
      table.increments();
      table.integer("id_envolvido").unsigned();
      table.string("matricula_solicitante", 8);
      table.string("nome_solicitante", 45);
      table.string("cd_prefixo_solicitante", 4);
      table.string("nome_prefixo_solicitante", 45);
      table.text("txt_pedido");
      table.boolean("prorrogado").defaultTo(false);
      table.text("txt_resposta").defaultTo(null);
      table.datetime("respondido_em").defaultTo(null);
      table.integer("qtd_diasTrabalhados").unsigned().defaultTo(0);
      table.datetime("revelia_em").defaultTo(null);
      table.timestamps(true, true);

      table
        .foreign("id_envolvido")
        .references("id")
        .inTable(`${pgSchema}.envolvidos`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.recursos`, table => {
      table.increments();
      table.integer("id_envolvido").unsigned().notNullable();
      table.integer("id_medida").unsigned().notNullable();
      table.string("txt_recurso", 755);
      table.enum("tipo", ["ETICO_NEGOCIAL"]);
      table.string("parecer_anterior", 755).notNullable();
      table.datetime("revelia_em").defaultTo(null);
      table.datetime("respondido_em").defaultTo(null);
      table.timestamps(true, true);

      table
        .foreign("id_envolvido")
        .references("id")
        .inTable(`${pgSchema}.envolvidos`)
        .onDelete("cascade");

      table
        .foreign("id_medida")
        .references("id")
        .inTable(`${pgSchema}.medidas`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.anexos`, table => {
      table.increments();
      table.string("nome_arquivo", 50);
      table.string("extensao", 5);
      table.string("mime_type", 100);
      table.string("nome_original", 50);
      table.enum("tipo", ["ESCLARECIMENTO", "PARECER", "RECURSO"]);
      table.string("incluido_por", 8);
      table.text("base64");
      table.timestamps(true, true);
    });

    //Tabelas auxiliares

    this.create(`${pgSchema}.envolvidos_anexos`, table => {
      table.integer("id_envolvido").unsigned();
      table.integer("id_anexo").unsigned();

      table
        .foreign("id_envolvido")
        .references("id")
        .inTable(`${pgSchema}.envolvidos`)
        .onDelete("cascade");
      table
        .foreign("id_anexo")
        .references("id")
        .inTable(`${pgSchema}.anexos`)
        .onDelete("cascade");
    });

    this.create(`${pgSchema}.parecer_recurso_anexos`, table => {
      table.integer("id_recurso").unsigned();
      table.integer("id_anexo").unsigned();

      table
        .foreign("id_recurso")
        .references("id")
        .inTable(`${pgSchema}.recursos`)
        .onDelete("cascade");
      table
        .foreign("id_anexo")
        .references("id")
        .inTable(`${pgSchema}.anexos`)
        .onDelete("cascade");
    });


    this.create(`${pgSchema}.esclarecimentos_anexos`, table => {
      table.integer("id_esclarecimento").unsigned();
      table.integer("id_anexo").unsigned();
      table
        .foreign("id_esclarecimento")
        .references("id")
        .inTable(`${pgSchema}.esclarecimentos`)
        .onDelete("cascade");
      table
        .foreign("id_anexo")
        .references("id")
        .inTable(`${pgSchema}.anexos`)
        .onDelete("cascade");
    });
  }

  down() {
    this.drop(`${pgSchema}.envolvidos_anexos`);
    this.drop(`${pgSchema}.esclarecimentos_anexos`);
    this.drop(`${pgSchema}.anexos`);
    this.drop(`${pgSchema}.esclarecimentos`);
    this.drop(`${pgSchema}.timeline`);
    this.drop(`${pgSchema}.envolvidos`);
    this.drop(`${pgSchema}.medidas`);
    this.drop(`${pgSchema}.mtns`);
    this.drop(`${pgSchema}.tipos_acao`);
    this.drop(`${pgSchema}.status`);
    // this.drop(`${pgSchema}.visoes`)
  }
}

module.exports = MtnSchema;
