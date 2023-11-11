const TiposModel = use("App/Models/Mysql/FlexCriterios/Tipos");

class Tipos {
  async getTipos() {
    const consulta = await TiposModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Tipos;
