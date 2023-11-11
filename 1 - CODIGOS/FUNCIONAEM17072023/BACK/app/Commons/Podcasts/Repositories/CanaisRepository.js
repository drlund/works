"use strict";

const { id } = require('../../../Models/Mysql/Patrocinios/GestaoProjetosPatrocinios');

const Canal = use("App/Models/Mysql/Podcasts/Canal");
const Episodio = use("App/Models/Mysql/Podcasts/Episodio");
const Seguidor = use("App/Models/Mysql/Podcasts/Seguidor");

class CanaisRepository {

  async countEpisodiosCanal(idCanal) {
    const totalEpisodios = await Episodio.query().where('idCanal', idCanal).count()
    return totalEpisodios[0]['count(*)'];
  }

  async countSeguidoresCanal(idCanal) {
    const totalSeguidores = await Seguidor.query().where('idCanal', idCanal).count()
    return totalSeguidores[0]['count(*)'];
  }

  async getCanais() {
    const canais = await Canal.query()
    .where("ativo", 1)
    .fetch();
    return canais ? canais.toJSON() : null;
  }

  async getCanalById(id) {
    const canal = await Canal.query()
      .where('id', id)
      .andWhere('ativo', 1)
      .fetch();
    return canal ? canal.toJSON() : null;
  }

  async postCanal(
    nome,
    descricao,
    uorResponsavel,
    prefixoResponsavel,
    nomePrefixoResponsavel,
    nomeResponsavel,
    matriculaResponsavel,
    imagem,
  ) {
    return Canal.create({
      nome,
      descricao,
      uorResponsavel,
      prefixoResponsavel,
      nomePrefixoResponsavel,
      nomeResponsavel,
      matriculaResponsavel,
      imagem,
    })
  }

  async updateCanal(
    id,
    alteracoes
  ) {
    const atualizar = await Canal.find(id);
    atualizar.merge(alteracoes);
    await atualizar.save();
    return atualizar;
  }

  async updateCapaCanal(
    id,
    novaImagem
  ) {
    const atualizar = await Canal.find(id);
    atualizar.merge({ imagem: novaImagem });
    await atualizar.save();
    return atualizar;
  }

  async deleteCanal(id) {
    const deletar = await Canal.find(id);
    deletar.merge({ ativo: "0" });
    await deletar.save();

    return deletar;
  }

}


module.exports = CanaisRepository;
