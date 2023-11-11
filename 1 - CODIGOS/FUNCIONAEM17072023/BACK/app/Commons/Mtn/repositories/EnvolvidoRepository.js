"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnPrazosSuperModel = use("App/Models/Postgres/MtnVwAguardandoAnalise");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoAnexoModel = use("App/Models/Postgres/MtnEnvolvidoAnexo");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const aprovacaoModel = use("App/Models/Postgres/MtnAprovacoesMedida");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const parecerRecursoAnexoModel = use(
  "App/Models/Postgres/MtnParecerRecursoAnexo"
);

const moment = require("moment");
const { mtnConsts } = require("../../Constants");
class EnvolvidoRepository {
  /**
   * Retorna uma lista de arrays que estão pendentes de aprovação.
   * Caso seja infomada uma lista de ids, a busca será feita somente
   * entre eles
   *
   * @param {*} idsEnvolvidos
   * @returns
   */
  async getPareceresPendentesAprovacao(idsEnvolvidos) {
    const query = envolvidoModel.query();

    if (idsEnvolvidos && Array.isArray(idsEnvolvidos)) {
      query.whereIn("id", idsEnvolvidos);
    }

    const pendencias = await query
      .where("aprovacao_pendente", true)
      .with("medida")
      .with("medidaSugerida")
      .with("mtn")
      .fetch();

    return pendencias.toJSON();
  }

  async getDadosEnvolvido({ idEnvolvido, loadRecursos, loadAnexos }, trx) {
    const qbDadosEnvolvido = envolvidoModel.query();

    if (trx) {
      qbDadosEnvolvido.transacting(trx);
    }

    const envolvido = await qbDadosEnvolvido
      .where("id", idEnvolvido)
      .with("recursos")
      .with("anexos", (builder) => {
        builder.with("dadosAnexo");
      })
      .first();

    return envolvido.toJSON();
  }

  async salvarAprovacaoMedida(dadosAprovacao, trx) {
    await aprovacaoModel.create(
      {
        analista_matricula: dadosAprovacao?.analista_matricula,
        analista_nome: dadosAprovacao?.analista_nome,
        analise_em: dadosAprovacao?.analise_em,
        id_medida_proposta: dadosAprovacao?.id_medida_proposta,
        aprovador_matricula: dadosAprovacao?.aprovador_matricula,
        aprovador_nome: dadosAprovacao?.aprovador_nome,
        id_envolvido: dadosAprovacao?.id_envolvido,
        id_medida_aprovada: dadosAprovacao?.id_medida_aprovada,
        parecer_proposto: dadosAprovacao?.parecer_proposto,
        parecer_aprovado: dadosAprovacao.parecer_aprovado
          ? dadosAprovacao.parecer_aprovado
          : dadosAprovacao?.parecer_proposto,
        alterado:
          typeof dadosAprovacao.alterado === "boolean"
            ? dadosAprovacao.alterado
            : false,
      },
      trx
    );
  }

  async filtrarEnvolvidos({
    nrMtn,
    matriculaEnvolvido,
    matriculaAnalista,
    dataInicio,
    dataFinal,
  }) {
    const qbEnvolvidos = envolvidoModel.query();
    if (nrMtn) {
      qbEnvolvidos.whereHas("mtn", (builder) => {
        builder.where("nr_mtn", nrMtn);
      });
    }

    if (matriculaEnvolvido) {
      qbEnvolvidos.where("matricula", matriculaEnvolvido);
    }

    if (matriculaAnalista) {
      qbEnvolvidos.where("mat_resp_analise", matriculaAnalista);
    }

    qbEnvolvidos
      .whereNotNull("id_medida")
      .whereNotNull("mat_resp_analise")
      .whereNotNull("nome_resp_analise")
      .whereNotNull("txt_analise")
      .where("respondido_em", ">=", `${dataInicio} 00:00:00`)
      .where("respondido_em", "<=", `${dataFinal} 23:59:59`)
      .with("medida")
      .with("medidaSugerida");

    const envolvidos = await qbEnvolvidos.fetch();
    return envolvidos.toJSON();
  }

  async getDadosCompletosEnvolvido(idEnvolvido) {
    const envolvido = await envolvidoModel.find(idEnvolvido);
    await envolvido.load("medida");
    await envolvido.load("medidaSugerida");
    await envolvido.load("mtn");
    await envolvido.load("anexos", (builder) => builder.with("dadosAnexo"));
    await envolvido.load("esclarecimentos", (builder) => {
      builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      builder.orderBy("created_at");
    });
    await envolvido.load("recursos", (builder) => {
      builder.with("anexos", (builder) => builder.with("dadosAnexo"));
      builder.with("anexosParecer", (builder) => builder.with("dadosAnexo"));
    });
    await envolvido.load("timeline", (builder) => {
      builder.with("acao");
      builder.orderBy("created_at");
    });

    return envolvido.toJSON();
  }

  async moveAnexosToRecurso({ idEnvolvido, idRecurso, anexos }, trx) {
    const arrayIds = anexos.map((anexo) => anexo.id_anexo);
    await envolvidoAnexoModel
      .query()
      .transacting(trx)
      .whereIn("id_anexo", arrayIds)
      .where("id_envolvido", idEnvolvido)
      .delete();
    await parecerRecursoAnexoModel.createMany(
      arrayIds.map((id) => {
        return { id_anexo: id, id_recurso: idRecurso };
      }),
      trx
    );
  }

  async limparParecerEnvolvido(idEnvolvido, pendenteRecurso, trx) {
    const envolvido = await envolvidoModel.find(idEnvolvido);
    envolvido.pendente_recurso = pendenteRecurso;
    envolvido.txt_analise = null;
    envolvido.mat_resp_analise = null;
    envolvido.nome_resp_analise = null;
    envolvido.id_medida = null;
    await envolvido.save(trx);
  }

  async marcarEnvolvidoComoAprovado(idEnvolvido, trx) {
    const envolvido = await envolvidoModel.find(idEnvolvido);
    envolvido.aprovacao_pendente = false;
    envolvido.aprovacao_aprovado_em = moment().format("YYYY-MM-DD HH:mm");
    await envolvido.save(trx);
  }

  async update(idEnvolvido, newDadosEnvolvido, trx) {
    await envolvidoModel
      .query()
      .transacting(trx)
      .where("id", idEnvolvido)
      .update(newDadosEnvolvido);
  }

  async create(dadosEnvolvido, trx) {
    await envolvidoModel.create(dadosEnvolvido, trx);
  }

  async getEnvolvido(idEnvolvido, trx) {
    const envolvidoOriginal = await envolvidoModel
      .query()
      .transacting(trx)
      .where("id", idEnvolvido)
      .first();

    return envolvidoOriginal.toJSON();
  }

  async duplicar(idEnvolvido, trx) {
    const envolvidoOriginal = await this.getEnvolvido(idEnvolvido, trx);

    const novoEnvolvido = await envolvidoModel.create(
      {
        id_mtn: envolvidoOriginal.id_mtn,
        matricula: envolvidoOriginal.matricula,
        nome_funci: envolvidoOriginal.nome_funci,
        resumo_orientacao: envolvidoOriginal.resumo_orientacao,
        desc_orientacao: envolvidoOriginal.desc_orientacao,
        cd_cargo_epoca: envolvidoOriginal.cd_cargo_epoca,
        nome_cargo_epoca: envolvidoOriginal.nome_cargo_epoca,
        cd_prefixo_epoca: envolvidoOriginal.cd_prefixo_epoca,
        nome_prefixo_epoca: envolvidoOriginal.nome_prefixo_epoca,
        id_medida: null,
        id_medida_prevista: envolvidoOriginal.id_medida_prevista,
        respondido_em: null,
        mat_resp_analise: null,
        nome_resp_analise: null,
        txt_analise: null,
        pendente_recurso: false,
        nr_gedip: null,
        dias_desde_ultima_acao: 0,
        instancia: mtnConsts.acoesInstancias.ENVOLVIDO,
        id_resposta: envolvidoOriginal.id_resposta,
        id_visao: envolvidoOriginal.id_visao,
        enviado_aprovacao_em: null,
        aprovacao_pendente: false,
        versionado: false,
        versionado_por_matricula: null,
        versionado_por_nome: null,
        versionado_em: null,
        versao_id_original: envolvidoOriginal.id,
        versao_id_nova: null,
      },
      trx
    );

    return novoEnvolvido.toJSON();
  }

  async isEnvolvidoExiste(idEnvolvido) {
    const existe = await envolvidoModel
      .query()
      .where("id", idEnvolvido)
      .getCount();

    return existe ? parseInt(existe) : existe;
  }

  async getPrazosSuperAprovacoes() {
    const prazos = await mtnPrazosSuperModel.query().fetch();
    return prazos ? prazos.toJSON() : null;
  }
}

module.exports = EnvolvidoRepository;
