const AcoesModel = use("App/Models/Mysql/FlexCriterios/Acoes");

class Acoes {
  async getAcoes() {
    const consulta = await AcoesModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Acoes;
