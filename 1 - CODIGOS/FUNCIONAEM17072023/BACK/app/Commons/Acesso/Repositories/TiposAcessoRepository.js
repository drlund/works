const tiposAcessoModel = use(
  "App/Models/Mongo/TiposAcesso"
);

class TiposAcessoRepository {
  async find() {

  }

  async getAll() {
    const tiposAcesso = await tiposAcessoModel
      .find({});
    return tiposAcesso;
  }
}

module.exports = TiposAcessoRepository;
