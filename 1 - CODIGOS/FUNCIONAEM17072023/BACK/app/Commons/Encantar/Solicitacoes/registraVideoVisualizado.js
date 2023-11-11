/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const videosVisualizadosModel = use(
  "App/Models/Mysql/Encantar/SolicitacoesCapacitacaoVideosVisualizados"
);

const exception = use("App/Exceptions/Handler");

/**
 *
 * Registra que um vídeo foi finalizado
 *
 *  @param {Number} idVideo
 *  @param {String} matricula
 *
 *  @throws {exeption}
 *
 */

const registraVideoVisualizado = async (idVideo, matricula, nomeFunci) => {
  try {
    const visualizado = new videosVisualizadosModel();
    visualizado.idVideo = idVideo;
    visualizado.matricula = matricula;
    visualizado.nome = nomeFunci;
    await visualizado.save();
  } catch (error) {
    throw new exception(error, 500);
  }
};

module.exports = registraVideoVisualizado;
