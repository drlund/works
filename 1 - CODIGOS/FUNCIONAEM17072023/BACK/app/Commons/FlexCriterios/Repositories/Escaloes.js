const { getListaComitesAdm } = use("App/Commons/Arh/dadosComites");
const EscaloesModel = use("App/Models/Mysql/FlexCriterios/Escaloes");
const ManifestacoesModel = use("App/Models/Mysql/FlexCriterios/Manifestacoes");

class Escaloes {
  async getEscaloes() {
    const consulta = await EscaloesModel.query().where("ativo", 1).fetch();
    return consulta?.toJSON() ?? null;
  }

  async getEscalaoById(id) {
    const consulta = await EscaloesModel.query().where("id", id).fetch();
    return consulta?.toJSON() ?? null;
  }

  async getEscalaoEscolhido(prefixo, id_solicitacao) {
    const consulta = ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
      })
      .first();

    return consulta ?? null;
  }

  async getDadosEscalao(prefixo) {
    const consulta = await getListaComitesAdm(prefixo);

    return consulta;
  }
}

module.exports = Escaloes;
