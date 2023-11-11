/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const capacitacaoCursosModel = use(
  "App/Models/Mysql/Encantar/SolicitacoesCapacitacaoCursos"
);

/**
 * @typedef {Object} Curso
 * @property {number} id
 * @property {string} titulo Nome do título
 * @property {string} url URL de acesso ao curso
 * @property {Object} createdAt
 * @property {Object} updatedAt
 * @property {Object[]} funcisTreinados Array de funcionários que foram treinados
 
*/

/**
 *
 *  Função que retorna a lista de vídeos obrigatórios para se utilizar a ferramenta encantar
 *  e se já foram finalizados (visualizados pelo usuário) ou não.
 *  @function
 *  @param {string} matricula
 *  @returns {Curso} Curso obrigatório para utilizar a ferramenta
 *
 */

async function getCapacitacaoCursos(matricula) {
  const cursos = await capacitacaoCursosModel
    .query()
    .with("funcisTreinados", (builder) => {
      builder.where("matricula", matricula);
    })
    .fetch();
  return cursos;
}

module.exports = getCapacitacaoCursos;
