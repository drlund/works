"use strict";
const Database = use("Database");
const Evento = use("App/Models/Mysql/Ambiencia/Evento");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const EventoPrefixoLock = use("App/Models/Mysql/Ambiencia/EventoPrefixoLock");
const LockFactory = use("App/Commons/Ambiencia/ModelFactory/LockFactory");

class PrefixosLockRepository {
  async getLockById(idLock) {
    const lock = await EventoPrefixoLock.find(idLock);
    return lock ? lock.toJSON() : null;
  }

  async removerLock(idLock, trx) {
    await EventoPrefixoLock.query()
      .transacting(trx)
      .where("id", idLock)
      .delete();
  }

  async getPrefixoLockedByUserEvento(idEvento, matricula) {
    const prefixoLock = await EventoPrefixoLock.query()
      .where({
        idEvento: idEvento,
        matricula: matricula,
      })
      .first();
    if (prefixoLock) {
      return prefixoLock.toJSON();
    }
    return prefixoLock;
  }

  async setLock(data, usuario) {
    const lockFactory = new LockFactory();
    const lock = await lockFactory.lock(data, usuario);
    const lockData = await lock.save();
    if (lockData) {
      return lock.toJSON();
    }
    return null;
  }

  async getPrefixoSortToLock(idEvento, diretoriaParticipante) {
    const diretoria =
      diretoriaParticipante.length === 4
        ? [diretoriaParticipante]
        : diretoriaParticipante.split(",");

    const prefixoSelecionado = await Evento.query()
      .select(
        "eventos.id as idEvento",
        "eventos.descricao",
        "tb_imagens.prefixo",
        "tb_imagens.cd_subord as subord",
        "mst606.uor_dependencia as uor"
      )
      .innerJoin(
        "eventosRegrasAmbientes",
        "eventosRegrasAmbientes.idEvento",
        "eventos.id"
      )
      .innerJoin(
        "tb_imagens_tipo",
        "tb_imagens_tipo.id",
        "eventosRegrasAmbientes.idImagemTipo"
      )
      .innerJoin("tb_imagens", "tb_imagens.tipo", "tb_imagens_tipo.id")
      .innerJoin("DIPES.mst606", function () {
        this.on("DIPES.mst606.prefixo", "tb_imagens.prefixo").andOn(
          "DIPES.mst606.cd_subord",
          "tb_imagens.cd_subord"
        );
      })
      .leftJoin("eventosAvaliacoes", function () {
        this.on(
          "eventosAvaliacoes.idRegraAmbiente",
          "eventosRegrasAmbientes.id"
        )
          .andOn("tb_imagens.prefixo", "eventosAvaliacoes.prefixo")
          .andOn("tb_imagens.cd_subord", "eventosAvaliacoes.cd_subord");
      })
      .leftJoin("eventosPrefixosLock", function () {
        this.on("eventosPrefixosLock.idEvento", "eventos.id")
          .andOn("eventosPrefixosLock.prefixo", "tb_imagens.prefixo")
          .andOn("eventosPrefixosLock.cd_subord", "tb_imagens.cd_subord");
      })
      .whereBetween("tb_imagens.data_inclusao", [
        Database.raw("eventos.dataInicio"),
        Database.raw(`eventos.dataEncerramento`),
      ])
      .where("eventos.id", idEvento)
      .whereNull("eventosPrefixosLock.idEvento")
      .whereNull("eventosAvaliacoes.id")
      .whereIn("DIPES.mst606.cd_diretor_juris", diretoria)
      .orderBy("eventos.id", "asc")
      .orderBy("tb_imagens.data_inclusao", "desc")
      .limit(1)
      .first();

    if (prefixoSelecionado) {
      return prefixoSelecionado.toJSON();
    }
    return prefixoSelecionado;
  }
}

module.exports = PrefixosLockRepository;
