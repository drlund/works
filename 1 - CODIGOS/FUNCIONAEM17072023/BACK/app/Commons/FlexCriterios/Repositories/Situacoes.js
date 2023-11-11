const SituacoesModel = use("App/Models/Mysql/FlexCriterios/Situacoes");

class Situacoes {
  async getSituacoes() {
    const consulta = await SituacoesModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Situacoes;
