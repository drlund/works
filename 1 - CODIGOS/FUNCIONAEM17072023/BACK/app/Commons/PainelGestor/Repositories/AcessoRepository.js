"use strict";
const pilotoPrefixos = use("App/Models/Mysql/PainelGestor/PilotoPrefixo");
class AcessoRepository {
  async pilotoVigente() {
    const resposta = await pilotoPrefixos.getCount();
    return Boolean(resposta);
  }

  async isParticipantePiloto(prefixo) {
    const lista = await pilotoPrefixos.query()
      .where("prefixo", prefixo)
      .orWhere("gerev", prefixo)
      .orWhere("super", prefixo)
      .getCount();

    return Boolean(lista);

  }
}

module.exports = AcessoRepository;