"use strict";
const EventoRegrasAmbiente = use(
  "App/Models/Mysql/Ambiencia/EventoRegrasAmbiente"
);
const ImagemTipo = use("App/Models/Mysql/Ambiencia/ImagemTipo");

class AmbientesRepository {
  async getRegraAmbienteByIdAmbiente(ambienteTipo) {
    const regraAmbiente = await EventoRegrasAmbiente.query()
      .where("idImagemTipo", ambienteTipo)
      .first();

    return regraAmbiente;
  }

  async getAmbientesByIdEvento(idEvento) {
    const ambientesDoEvento = await EventoRegrasAmbiente.query()
      .where("idEvento", idEvento)
      .fetch();
    if (ambientesDoEvento) {
      return ambientesDoEvento.toJSON();
    }
    return ambientesDoEvento;
  }

  /**
   *
   * @param {Array} listaIds Mesmo que a consulta seja de um único ambiente o parametro deve ser um array
   * @returns A lista dos detalhes dos ambientes selecionados
   */
  async getDadosAmbientesByIds(listaIds) {
    const ambientesData = await ImagemTipo.query()
      .whereIn("id", listaIds)
      .fetch();
    if (ambientesData) {
      return ambientesData.toJSON();
    }
    return ambientesData;
  }
}

module.exports = AmbientesRepository;
