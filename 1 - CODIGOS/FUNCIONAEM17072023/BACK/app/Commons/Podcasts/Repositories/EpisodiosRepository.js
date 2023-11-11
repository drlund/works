"use strict";

const Episodio = use("App/Models/Mysql/Podcasts/Episodio");
const EpisodioLike = use("App/Models/Mysql/Podcasts/EpisodioLike");

class EpisodiosRepository {

  async getEpisodios() {
    const episodios = await Episodio.query()
      .with("tags")
      .with("canal")
      .with("likes")
      .where("ativo", 1)
      .fetch();
    return episodios ? episodios.toJSON() : null;
  }

  async getEpisodioById(id) {
    const episodio = await Episodio.query()
      .where('id', id)
      .andWhere('ativo', 1)
      .fetch();
    return episodio ? episodio.toJSON() : null;
  }

  async getLikesEpisodios() {
    const likesEpisodios = await EpisodioLike.query()
      .where("ativo", 1)
      .fetch();
    return likesEpisodios ? likesEpisodios.toJSON() : null;
  }

  async countLikesEpisodio(idEpisodio) {
    const likes = await EpisodioLike.query()
      .where('idEpisodio', idEpisodio)
      .andWhere('ativo', 1)
      .count();
    return likes[0]['count(*)'];
  }

  async verifyLikeStatus(idEpisodio, matricula) {
    const registroDoLike = await EpisodioLike.query().where('idEpisodio', idEpisodio)
      .where('matricula', matricula)
      .fetch();
    return registroDoLike.toJSON();
  }

  async dislikeEpisodio(id) {
    const alteraLike = await EpisodioLike.find(id);
    alteraLike.merge({ ativo: "0" });
    await alteraLike.save();
  }

  async likeEpisodio(id) {
    const alteraLike = await EpisodioLike.find(id);
    alteraLike.merge({ ativo: "1" });
    await alteraLike.save();
  }

  async episodioIsLiked(idEpisodio, matricula) {
    const likedEpisodio = await EpisodioLike.query()
      .where('idEpisodio', idEpisodio)
      .where('matricula', matricula)
      .andWhere('ativo', 1)
      .count();
    return likedEpisodio[0]['count(*)'];
  }

  async criarLike(
    matricula,
    nome,
    idEpisodio
  ) {
    return await EpisodioLike.create(
      {
        matricula,
        nome,
        idEpisodio
      }
    );
  }

  async deleteEpisodio(id) {
    const deletar = await Episodio.find(id);
    deletar.merge({ ativo: "0" });
    await deletar.save();

    return deletar;
  }

  async criarEpisodio(
    idCanal,
    titulo,
    matriculaResponsavel,
    nomeResponsavel,
    urlEpisodio, trx
  ) {
    return await Episodio.create({
      idCanal,
      titulo,
      matriculaResponsavel,
      nomeResponsavel,
      urlEpisodio,
    }, trx);
  }

  async updateEpisodio(id, novoTitulo) {
    const atualizarEpisodio = await Episodio.find(id);
    atualizarEpisodio.merge({ titulo: novoTitulo });
    await atualizarEpisodio.save();

    return atualizarEpisodio;
  }
}

module.exports = EpisodiosRepository;
