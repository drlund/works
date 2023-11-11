'use strict';

const Plataformas = use('App/Models/Mysql/GerenciadorFerramentas/Plataformas');

class PlataformasRepository {
  async getPlataformas() {
    const plataformas = await Plataformas.query()
      .with('nucleos')
      .fetch();

    return plataformas.toJSON();
  }

  async patchPlataforma(id, matriculaResponsavel) {
    const editaPlataforma = await Plataformas.find(id);
    console.log('Id: ', id);

    if (!editaPlataforma) {
      throw new Error("Plataforma não encontrada!");
    }

    editaPlataforma.merge({
      matriculaResponsavel,
    });

    await editaPlataforma.save();
  }
}

module.exports = PlataformasRepository;
