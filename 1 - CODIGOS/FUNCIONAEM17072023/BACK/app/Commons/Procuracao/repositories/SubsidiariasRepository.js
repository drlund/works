const SubsidiariasModel = use("App/Models/Mysql/Procuracao/Subsidiaria");

class SubsidiariasRepository {
  async getSubsidiarias() {
    const subsidiarias = await SubsidiariasModel.query()
      .where("ativo", 1)
      .fetch();

    return subsidiarias;
  }

  async cadastrarSubsidiaria(dadosSubsidiaria) {
    await SubsidiariasModel.create(dadosSubsidiaria);
  }
}

module.exports = SubsidiariasRepository;
