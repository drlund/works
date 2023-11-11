const EtapasModel = use("App/Models/Mysql/FlexCriterios/Etapas");

class Etapas {
  async getEtapas() {
    const consulta = await EtapasModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Etapas;
