const exception = use('App/Exceptions/Handler');
const Designacao = use('App/Models/Mysql/Designacao');
const _ = require('lodash');

//Private methods
async function getMatchedCodsAusencia(ausencia, lista = []) {
  try{
    let codigos = await Designacao.query()
      .table("cod_ausencia")
      .where("codigo", "like", `%${ausencia}%`)
      .orWhere("nome", "like", `%${ausencia}%`)
      .fetch();

    codigos = codigos.toJSON();

    if (lista.length) {
      codigos = codigos.filter(elem => {
        if (_.head(lista) === "535") {
          return elem.codigo !== "535";
        }
        return !_.isEmpty(_.intersection(lista, [elem.codigo]));
      })
    }

    return codigos;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getMatchedCodsAusencia;
