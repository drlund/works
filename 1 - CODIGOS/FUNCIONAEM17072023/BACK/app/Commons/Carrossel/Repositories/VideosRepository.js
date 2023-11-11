"use strict";

const Videos = use("App/Models/Mysql/Carrossel/VideosCarrossel");
const moment = use("App/Commons/MomentZone");
const Database = use("Database");

class VideosRepository {

  async getVideo() {
    const video = await Videos.query()
      .where("ativo", 1)
      .where("dataInicioReproducao", "<=", moment().format("YYYY-MM-DD"))
      .where("dataFimReproducao", "<=", moment().format("YYYY-MM-DD"))
      .where("dataFimReproducao", "<=", Database.raw(`dataInicioReproducao`))
      .orderBy("updatedAt", "desc")
      .first();
    return video
  }

  async getVideoFallBack() {
    const videoFallback = Videos.query()
      .where("ativo", 1)
      .where("dataFimReproducao", "<=", Database.raw(`dataInicioReproducao`))
      .orderBy("updatedAt", "desc");
    return videoFallback.first();
  }

  async getVideos() {
    const videos = await Videos.query()
      .where("ativo", 1)
      .orderBy("dataInicioReproducao", "desc")
      .fetch()
    return videos;
  }

  async postVideo(
    urlVideo,
    dataInicioReproducao,
    dataFimReproducao,
    matriculaFunci,
    nomeFunci
  ) {
    return await Videos.create({
      urlVideo,
      dataInicioReproducao,
      dataFimReproducao,
      matriculaFunci,
      nomeFunci
    })
  }

  async deleteVideo(id) {
    const deletar = await Videos.find(id);
    deletar.merge({ ativo: '0' });
    await deletar.save();

    return deletar;
  }

  async updateVideo(id, novaDataInicioReproducao) {
    const atualizar = await Videos.find(id);
    atualizar.merge({ dataInicioReproducao: novaDataInicioReproducao });
    await atualizar.save();

    return atualizar;
  }

}

module.exports = VideosRepository;
