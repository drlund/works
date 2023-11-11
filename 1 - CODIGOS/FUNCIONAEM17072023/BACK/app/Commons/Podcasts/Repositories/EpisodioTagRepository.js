"use strict";

const EpisodioTag = use("App/Models/Mysql/Podcasts/EpisodioTag");

class EpisodioTagRepository {

  async salvarMany(arrayDeObjetos, trx) {
    return EpisodioTag.createMany(arrayDeObjetos, trx);
  }

}


module.exports = EpisodioTagRepository;
