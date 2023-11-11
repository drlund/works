/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const capacitacaoVideosModel = use(
  "App/Models/Mysql/Encantar/SolicitacoesCapacitacaoVideosLista"
);

/**
 * @typedef {Object} Video
 * @property {number} id
 * @property {string} titulo
 * @property {string} nomeVideo
 * @property {Object} createdAt
 * @property {Object} updatedAt
 * @property {Object[]} visualizacoes
 
*/

/**
 *
 *  Função que retorna a lista de vídeos obrigatórios para se utilizar a ferramenta encantar
 *  e se já foram finalizados (visualizados pelo usuário) ou não.
 *  @function
 *  @param {string} matricula Matrícula do funcionário que se deseja consultar os cursos obrigatórios
 *  @returns {Video}
 *
 */

async function getCapacitacaoVideos(matricula) {
  const videos = await capacitacaoVideosModel
    .query()
    .with("visualizacoes", (builder) => {
      builder.where("matricula", matricula);
    })
    .fetch();
  return videos;
};

module.exports = getCapacitacaoVideos;
