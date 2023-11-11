"use strict";
const Imagem = use("App/Models/Mysql/Ambiencia/Imagem");
const EventoAvaliacaoModel = use("App/Models/Mysql/Ambiencia/EventoAvaliacao");

class AvaliacaoRepository {
  async getDadosToAvaliacao(idsAmbiente, prefixo, subord, periodo) {
    const ambientesJaAvaliados = await EventoAvaliacaoModel.query()
      .where("prefixo", prefixo)
      .where("cd_subord", subord)
      .fetch();

    const idsAmbientesJaAvaliados = ambientesJaAvaliados
      .toJSON()
      .map((ambienteJaAvaliado) => ambienteJaAvaliado.idImagemTipo);
    const idsAmbientesPendentes = idsAmbiente.filter((id) => {
      return !idsAmbientesJaAvaliados.includes(id);
    });

    const imagensAmbientes = await Imagem.query()
      .select("tipo", "prefixo", "cd_subord as subord", "fullpath as url", "data_inclusao")
      .where({
        prefixo: prefixo,
        cd_subord: subord,
        ativo: 1
      })
      .whereIn("tipo", idsAmbientesPendentes)
      .whereBetween("data_inclusao", [
        periodo.dataInicio,
        periodo.dataEncerramento,
      ])
      .orderBy("data_inclusao", "desc")
      .with("ambiente")
      .fetch();
    if (imagensAmbientes) {
      return imagensAmbientes.toJSON();
    }
    return imagensAmbientes;
  }

  async gravarAvaliacoes(dadosAvaliacoes, trx) {
    await EventoAvaliacaoModel.createMany(dadosAvaliacoes, trx);
  }
}

module.exports = AvaliacaoRepository;
