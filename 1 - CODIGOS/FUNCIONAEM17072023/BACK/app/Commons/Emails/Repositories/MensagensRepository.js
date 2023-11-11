"use strict";

const FilaGlobalModel = use("App/Models/Mysql/FilaEmails/FilaGlobal");

const STATUS_PENDENTE = "PENDENTE";
const STATUS_EM_PROCESSAMENTO = "EM_PROCESSAMENTO";
const STATUS_PROCESSADO = "PROCESSADO";

class MensagensRepository {
  async descarregarMensagensFilaGlobal(mensagens) {
    const arrayGravacao = mensagens.map((elem) => {
      const { callback, ...dadosMensagem } = elem;
      return {
        ...dadosMensagem,
      };
    });
    await FilaGlobalModel.createMany(arrayGravacao);
  }

  async getFilaGlobal() {
    const mensagensFilaGlobal = await FilaGlobalModel.query()
      .where("status", STATUS_PENDENTE)
      .fetch();

    const arrayIds = mensagensFilaGlobal.toJSON().map((elem) => elem.id);
    await FilaGlobalModel.query()
      .whereIn("id", arrayIds)
      .update({ status: STATUS_EM_PROCESSAMENTO });

    return mensagensFilaGlobal.toJSON();
  }

  async marcarMensagemComoProcessada(idFila) {
    await FilaGlobalModel.query()
      .where("id", idFila)
      .update({ status: STATUS_PROCESSADO });
  }
}

module.exports = MensagensRepository;
