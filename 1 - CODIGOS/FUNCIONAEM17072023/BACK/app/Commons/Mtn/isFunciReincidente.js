/** @type {typeof import('@adonisjs/lucid/src/Database')} */
const Database = use("Database");
const { mtnConsts } = use("Constants");
const { pgSchema } = mtnConsts;

/**
 * 
 *  Função que consulta a view 'vw_matricula_reincidentes' para verificar se um funcionário é reincidente ou não. Um funci é considerado 
 * 
 *  reincidente quando tiver sido envolvido, nos últimos 12 meses, em protocolo MTN e sofrido uma das seguintes medidas:
 * 
 *    - Orientações
 *    - Alerta Ético Negocial
 *    - GEDIP
 *   
 *   
 * 
 * @param {*} matricula Matrícula do envolvido a ser consultado
 */

async function isFunciReincidente(matricula){
  const reincidencias = await Database.connection('pgMtn').from(`${pgSchema}.vw_matriculas_reincidentes`).where("matricula", matricula);
  return reincidencias.length > 1 ? true : false;

}


module.exports = isFunciReincidente;