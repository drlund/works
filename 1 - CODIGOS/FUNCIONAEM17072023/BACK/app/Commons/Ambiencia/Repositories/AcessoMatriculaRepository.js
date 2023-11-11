'use strict';
const AcessoMatricula = use("App/Models/Mysql/Ambiencia/EventoAcessoMatricula.js");

class AcessoMatriculaRepository {
  async getAcessoMatricula(matricula, idEvento) {
    const acessoByMatricula = await AcessoMatricula.query()
    .where({'matricula': matricula, 'idEvento': idEvento})
    .first();

    if(acessoByMatricula) {
      return acessoByMatricula.toJSON();
    }
    return acessoByMatricula;
  }
}

module.exports = AcessoMatriculaRepository;