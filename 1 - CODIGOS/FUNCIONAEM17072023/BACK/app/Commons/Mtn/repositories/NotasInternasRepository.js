"use strict";

const NotasInternas = use("App/Models/Postgres/MtnNotasInternas");
const NotasInternasLeitura = use("App/Models/Postgres/MtnNotasInternasLeitura");
const NotasInternasFactory = use(
  "App/Commons/Mtn/Factories/NotasInternasFactory"
);

class NotasInternasRepository {
  async gravarNovaNota(nota, usuario) {
    const notaFactory = new NotasInternasFactory();
    const novaNota = await notaFactory.novaNota(nota, usuario);
    return await novaNota.save();
  }

  async getNotasByEnvolvido(idEnvolvido) {
    const notas = await NotasInternas.query()
      .where("id_envolvido", idEnvolvido)
      .fetch();

    return !notas ? notas : notas.toJSON();
  }

  async gravarLeituraDaNota(idEnvolvido, idNotaInterna, usuario) {
    const notaFactory = new NotasInternasFactory();
    const leituraNota = await notaFactory.leituraNota(
      idEnvolvido,
      idNotaInterna,
      usuario
    );

    return await leituraNota.save();
  }

  async getNotasLidasByEnvolvidoEUsuario(idEnvolvido, matUsuario) {
    const notasLidas = await NotasInternasLeitura.query()
      .where({
        id_envolvido: idEnvolvido,
        mat_leitura: matUsuario,
      })
      .fetch();
    return !notasLidas ? notasLidas : notasLidas.toJSON();
  }

  async isNotaLida(idNotaInterna, matriculaUsuario) {
    const existe = await NotasInternasLeitura.query()
      .where("id_nota_interna", idNotaInterna)
      .where("mat_leitura", matriculaUsuario)
      .getCount();

    return existe ? parseInt(existe) : existe;
  }
}

module.exports = NotasInternasRepository;
