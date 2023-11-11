'use strict';

const Plataformas = use('App/Models/Mysql/GerenciadorFerramentas/Plataformas');

class PlataformasRepository {
  async getPlataformas() {
    const plataformas = await Plataformas.query()
      .with('nucleos')
      .fetch();

    return plataformas.toJSON();
  }

  async patchPlataforma(id) {
    return Plataformas.find(id);
  }

  async salvarPlataforma(plataforma) {
    await plataforma.save();
  }
}

module.exports = PlataformasRepository;