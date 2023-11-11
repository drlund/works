"use strict";

const { executeDB2Query } = require('../../Models/DB2/DB2Utils');

/**
 * Retorna dados que estão possivelmente truncados na tabela `DIPES.arhfot01`: nome e rg
 *
 * Sendo que o RG pode ser nulo.
 *
 * @param {string[]} listaDeMatriculas
 */
async function getDadosFunciDb2(listaDeMatriculas) {

  /**
   * A matricula na tabela é só numeros, então é necessario remover os "F"
   * das matriculas e zeros a esquerda não são problema.
   *
   * Retorna a matricula, já formatada, o nome e o RG tbm formatado.
   *
   * Para se buscar por uma lista de matriculas, para cada elemento da lista,
   * se adiciona um `?` para sinalizar um parametro a ser passado na consulta.
   *
   * @type {(len: number) => string}
   */
  const makeQuery = (len) => /*sql*/ `
    SELECT
      'F' || LPAD(vcb.MATRICULA_215, 7, '0') matricula,
      vcb.NOME_215 nome,
      TRIM(vcb.RG_NR_215) || ' - ' || TRIM(vcb.RG_ORGAO_EMISSOR) || '-' || TRIM(vcb.RG_UF_215) rg
    FROM DB2M3F.VS_CAD_BASC vcb
    WHERE vcb.MATRICULA_215 IN (${Array(len).fill('?').join(',')});
  `;

  const matriculas = listaDeMatriculas
    // tabela possui numeros como matricula, então é necessário remover os "F" das matriculas
    // a consulta quebra se não tiver numeros, então limpa o que não for numero
    .map((m) => m.replace(/\D/g, ''))
    // ele também quebra se enviar valores vazios
    .filter(Boolean);

  /** @type {{MATRICULA: string, NOME: string, RG: string}[]} */
  const result = await executeDB2Query(
    makeQuery(matriculas.length),
    matriculas
  );

  return result.map((f) => {
    // pode ser apenas matriculas muito antigas, mas existe resultados com o RG vazio (` - -`)
    // sendo o caso, é retornado nulo para ser tratado de outra forma
    const rgOk = f.RG?.replace(/[^\w]+/g, '').length > 0;

    return /** @type {{matricula: string, nome: string, rg: string|null}} */ ({
      matricula: f.MATRICULA,
      nome: f.NOME.trim(),
      rg: rgOk ? f.RG : null,
    });
  });
}

module.exports = {
  getDadosFunciDb2
};
