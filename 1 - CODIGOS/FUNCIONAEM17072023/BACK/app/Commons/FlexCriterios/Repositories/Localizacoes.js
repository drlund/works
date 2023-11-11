const LocalizacoesModel = use("App/Models/Mysql/FlexCriterios/Localizacoes");

class Localizacoes {
  async getLocalizacoes() {
    const consulta = await LocalizacoesModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Localizacoes;
