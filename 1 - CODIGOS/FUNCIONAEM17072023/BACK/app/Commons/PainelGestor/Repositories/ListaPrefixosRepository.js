"use strict";
const jurisdicaoSubordinada = use(
  "App/Models/Mysql/PainelGestor/JurisdicaoSubordinada"
);
class ListaPrefixosRepository {
  async getListaSubordinadas(prefixo) {
    const lista = await jurisdicaoSubordinada
      .query()
      .distinct("prefixo_subordinada", "cd_subord_subordinada")
      .where("prefixo_subordinada", prefixo)
      .orderBy("cd_subord_subordinada")
      .fetch();

    return lista ? lista.toJSON() : [];
  }
}

module.exports = ListaPrefixosRepository;
