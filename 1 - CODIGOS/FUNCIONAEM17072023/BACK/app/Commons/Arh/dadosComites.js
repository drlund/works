const { executeDB2Query } = use('App/Models/DB2/DB2Utils');
const exception = use('App/Exceptions/Handler');

const queryListaComites = `SELECT DISTINCT 
                              t1.CD_PRF_DEPE AS prefixo, t1.CD_UOR_DEPE AS uor_dependencia,
                              t1.CD_ETR_DCS AS cod_estrutura, t2.NM_ETR_DCS AS nome_estrutura_decisao,
                              3 AS QRUM_MINIMO, t1.TS_CMTE_SELD

                           FROM DB2ALC.FUN_ETR t1, DB2ALC.ETR_DCS t2, DB2ALC.NVL_FMA_DCS t3, 
                                                   (SELECT DISTINCT tx.CD_PRF_DEPE, tx.CD_ETR_DCS, (MAX(tx.TS_CMTE_SELD)) AS TS_CMTE_SELD
                                                    FROM DB2ALC.FUN_ETR tx
                                                    WHERE tx.CD_PRF_DEPE = ? /* PREFIXO PROCURADO! */
                                                    {COND_TIPO_COMITE}
                                                    GROUP BY tx.CD_PRF_DEPE, tx.CD_ETR_DCS ) t5

                           WHERE (t1.CD_ETR_DCS = t2.CD_ETR_DCS
                              AND t2.CD_NVL_DCS = t3.CD_NVL_DCS
                              AND t1.CD_PRF_DEPE = t5.CD_PRF_DEPE
                              AND t1.CD_ETR_DCS = t5.CD_ETR_DCS
                              AND t1.TS_CMTE_SELD = t5.TS_CMTE_SELD);`;

const queryFuncisComite = ` SELECT t1.CD_PRF_DEPE,
                                   t1.CD_ETR_DCS,
                                   t1.TS_CMTE_SELD,
                                   t1.CD_FUN,
                                   t1.CD_TIP_VOT

                            FROM DB2ALC.FUN_ETR t1
                            WHERE t1.CD_PRF_DEPE = ?
                              AND t1.CD_ETR_DCS = ?
                              AND t1.TS_CMTE_SELD >= (?);`;

const queryListaComitesByMatricula = `SELECT DISTINCT 
                                        t1.CD_PRF_DEPE  AS prefixo,
                                        t1.CD_UOR_DEPE  AS uor_dependencia,
                                        t1.CD_ETR_DCS   AS cod_estrutura_decisao,
                                        t2.NM_ETR_DCS   AS nome_estrutura_decisao,
                                        t1.TS_CMTE_SELD AS ts_criacao_estrutura,
                                        t1.CD_FUN       AS matricula_membro,
                                        t1.CD_TIP_VOT   AS tipo_votacao

                                      FROM 
                                        DB2ALC.FUN_ETR t1, 
                                        DB2ALC.ETR_DCS t2, 
                                        DB2ALC.NVL_FMA_DCS t3, 
                                        ( SELECT DISTINCT 
                                            t1.CD_PRF_DEPE, 
                                            t1.CD_ETR_DCS, 
                                            (MAX(t1.TS_CMTE_SELD)) AS TS_CMTE_SELD 

                                          FROM 
                                            DB2ALC.FUN_ETR t1 

                                          GROUP BY 
                                            t1.CD_PRF_DEPE, 
                                            t1.CD_ETR_DCS
                                        ) t5

                                      WHERE (t1.CD_ETR_DCS = t2.CD_ETR_DCS
                                      AND t2.CD_NVL_DCS = t3.CD_NVL_DCS
                                      AND t1.CD_PRF_DEPE = t5.CD_PRF_DEPE
                                      AND t1.CD_ETR_DCS = t5.CD_ETR_DCS
                                      AND t1.TS_CMTE_SELD = t5.TS_CMTE_SELD)
                                      AND t2.CD_FNLD_TIP_DCS = 2 
                                      AND t2.CD_FMA_DCS = 1
                                      AND t1.CD_FUN = ?;`

const queryListaComitesAdm = `SELECT DISTINCT 
                                t1.CD_PRF_DEPE  AS prefixo,
                                t1.CD_UOR_DEPE  AS uor_dependencia,
                                t1.CD_ETR_DCS   AS cod_estrutura_decisao,
                                t2.NM_ETR_DCS   AS nome_estrutura_decisao,
                                t1.TS_CMTE_SELD AS ts_criacao_estrutura,
                                t1.CD_FUN       AS matricula_membro,
                                t1.CD_TIP_VOT   AS tipo_votacao

                              FROM 
                                DB2ALC.FUN_ETR t1, 
                                DB2ALC.ETR_DCS t2, 
                                DB2ALC.NVL_FMA_DCS t3, 
                                  ( SELECT DISTINCT 
                                      t1.CD_PRF_DEPE, 
                                      t1.CD_ETR_DCS, 
                                      (MAX(t1.TS_CMTE_SELD)) AS TS_CMTE_SELD 

                                    FROM 
                                      DB2ALC.FUN_ETR t1 

                                    WHERE 
                                      t1.CD_PRF_DEPE = ? 

                                    GROUP BY 
                                      t1.CD_PRF_DEPE, 
                                      t1.CD_ETR_DCS
                                  ) t5

                              WHERE (t1.CD_ETR_DCS = t2.CD_ETR_DCS
                              AND t2.CD_NVL_DCS = t3.CD_NVL_DCS
                              AND t1.CD_PRF_DEPE = t5.CD_PRF_DEPE
                              AND t1.CD_ETR_DCS = t5.CD_ETR_DCS
                              AND t1.TS_CMTE_SELD = t5.TS_CMTE_SELD)
                              AND (t2.IN_VRF_JRDC = 'N' 
                              AND t2.CD_FNLD_TIP_DCS = 2);`


/**
 * Obtem a lista de todos os comites vigentes de um deteminado prefixo.
 * @param {Integer} prefixo 
 */
async function getListaComites(prefixo) {
  try {
    prefixo = parseInt(prefixo);
    let query = queryListaComites.replace("{COND_TIPO_COMITE}", "")
    let dados = await executeDB2Query(query, [prefixo]);
    return dados;
  } catch (err) {
    throw new exception(err, 400);
  }
}

/**
 * Metodo que obtem a lista de membros de um comite.
 * de uma dependencia.
 * 
 * @param {String} prefixo - prefixo a ser pesquisado o comite
 * @param {Integer} codigoComite - codigo da estrutura de desisao (comite)
 * 
 */
async function getComposicaoComite(prefixo, codigoComite) {

  try {
    prefixo = parseInt(prefixo);

    let queryDadosComite = queryListaComites.replace("{COND_TIPO_COMITE}", "AND tx.CD_ETR_DCS = ?");
    let dadosComite = await executeDB2Query(queryDadosComite, [prefixo, codigoComite]);

    if (!dadosComite.length) {
      throw new exception(`Dados do comitê não encontrado! Prefixo: [${prefixo}] - Cod. Comite: [${codigoComite}]`);
    }

    let tsComite = dadosComite[0].TS_CMTE_SELD;
    let dados = await executeDB2Query(queryFuncisComite, [prefixo, codigoComite, tsComite]);
    return dados;

  } catch (err) {
    throw new exception(err, 400);
  }

}

/**
 * Obtem os dados individuais de um comite especifico.
 * @param {*} prefixo 
 * @param {*} codigoComite 
 */
async function getDadosComite(prefixo, codigoComite) {
  try {
    prefixo = parseInt(prefixo);

    let queryDadosComite = queryListaComites.replace("{COND_TIPO_COMITE}", "AND tx.CD_ETR_DCS = ?");
    let dadosComite = await executeDB2Query(queryDadosComite, [prefixo, codigoComite]);

    if (!dadosComite.length) {
      throw new exception(`Dados do comitê não encontrado! Prefixo: [${prefixo}] - Cod. Comite: [${codigoComite}]`);
    }

    return dadosComite;

  } catch (err) {
    throw new exception(err, 400);
  }

}

/**
 * Obtem a lista de todos os comites de administração vigentes de um deteminado prefixo.
 * @param {Integer} prefixo 
 */
async function getListaComitesAdm(prefixo) {
  try {
    prefixo = parseInt(prefixo);
    let dados = await executeDB2Query(queryListaComitesAdm, [prefixo]);
    return dados;
  } catch (err) {
    throw new exception(err, 400);
  }
}

/**
 * Obtem a lista de todos os comites vigentes que o funci é membro.
 * @param {String} matricula
 */
async function getListaComitesByMatricula(matricula) {
  try {
    matricula = matricula.toUpperCase();
    let dados = await executeDB2Query(queryListaComitesByMatricula, [matricula]);
    return dados;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = {
  getListaComites,
  getComposicaoComite,
  getDadosComite,
  getListaComitesAdm,
  getListaComitesByMatricula
}