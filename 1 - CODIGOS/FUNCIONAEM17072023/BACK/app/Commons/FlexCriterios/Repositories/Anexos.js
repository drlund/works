const AnexosModel = use("App/Models/Mysql/FlexCriterios/Anexos");

class Anexos {
  async getAnexoById(id) {
    const dbanexo = await AnexosModel.find(id);

    return dbanexo?.toJSON() ?? null;
  }

  async vincularAnexo(anexo, idFlex, trx) {
    return await AnexosModel.create(
      {
        id_solicitacao: idFlex,
        url: anexo.url,
        nome: anexo.name,
      },
      trx
    );
  }
}

module.exports = Anexos;
