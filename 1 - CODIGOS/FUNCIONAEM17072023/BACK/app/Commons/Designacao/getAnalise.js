const exception = use('App/Exceptions/Handler');
const Analise = use('App/Models/Mysql/Designacao/Analise');

async function getAnalise(id) {

  try {
    let analise = await Analise.findBy('id_solicitacao', id);

    analise = analise.toJSON();

    analise.analise = JSON.parse(analise.analise);
    analise.ausencias = JSON.parse(analise.ausencias);
    analise.cadeia = analise.cadeia ? JSON.parse(analise.cadeia) : [];
    analise.negativas = JSON.parse(analise.negativas);

    return analise;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAnalise;