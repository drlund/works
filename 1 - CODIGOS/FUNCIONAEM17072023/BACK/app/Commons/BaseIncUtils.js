const baseINCModel = use('App/Models/Mysql/INC/BaseInc');
const baseINCResumidaModel = use('App/Models/Mysql/INC/BaseIncResumida');
const exception = use('App/Exceptions/Handler');
const { validate } = use('Validator');

module.exports = {

  /**
   * 
   * @param {*} params - parametros da requisicao:
   * 
   * (Integer) nroINC (obrigatorio) - Número da IN
   * (Integer) tipoNormativo (obrigatorio) - tipo de normativo: 
   *            0 - Informacao Auxiliar
   *            1 - Disposição Normativa
   *            2 - Procedimentos
   * 
   * (String) baseItem (opcional) - item pai base no qual serao retornados os filhos.
   * Se for omitido busca o primeiro nível dos titulos da IN informada para o tipo de 
   * normativo solicitado.
   * 
   */
  findNodes: async (params) => {
    let { nroINC, baseItem, codTipoNormativo, userRoles } = params;

    let schema = {
      nroINC: 'required|integer',
      codTipoNormativo: 'required|integer'
    }

    const validation = await validate({
      nroINC,
      codTipoNormativo
    }, schema);

    if (validation.fails()) {
      throw new exception("Campos obrigatórios não foram informados!", 400);
    }

    //obtem todas as permissoes possiveis para a IN solicitada
    let queryNeededPermissions = await baseINCModel.query()
      .distinct('CD_TRAN_ACSS_CTU')
      .where('CD_ASNT', nroINC)
      .where('CD_TIP_CTU_ASNT', codTipoNormativo)
      .fetch();

    //papeis de acesso que o usuarioa IN exige e o usuario possui
    //match das permissoes do usuario e as requeridas pela instrucao
    let authorizedAccessCodes = [];
    
    let userPermissions = userRoles ? userRoles : [];

    for (const code of queryNeededPermissions.rows) {
      let role = code.CD_TRAN_ACSS_CTU;

      if (userPermissions.includes(role)) {
        authorizedAccessCodes.push(role);
      }
    }

    let visibleFields = [
      'CD_ASNT',
      'TX_TIT_ASNT',
      'NR_VRS_ASNT',
      'NR_VRS_CTU_ASNT',
      'CD_TIP_CTU_ASNT',
      'TX_TIP_CTU_ASNT',
      'CD_NVL_PRGF_CTU',
      'CD_TIP_PRGF_CTU',
      'TX_TIP_PRGF',
      'NR_NVL_PRGF_CTU',
      'NR_ORD_PRGF_CTU',
      'TX_PRGF_CTU'
    ];
     
    let ocorrencias = [];   

    let query = baseINCModel.query()
      .where('CD_ASNT', nroINC)
      .where('CD_TIP_CTU_ASNT', codTipoNormativo)
      .whereIn('CD_TRAN_ACSS_CTU', authorizedAccessCodes)
      .where('SG_IDI_ASNT', 'POR')
      .distinct(visibleFields)
      .orderBy('NR_ORD_PRGF_CTU')
      .setVisible(visibleFields);

    if (baseItem) {
      let nivel = (baseItem.match(/\./g) || []).length + 1;
      let queryVerify = query.clone();

      query
        .where('CD_NVL_PRGF_CTU', 'like', `${baseItem}%`)
        .whereNot('CD_NVL_PRGF_CTU', baseItem)
        .where('NR_NVL_PRGF_CTU', nivel);
           
      ocorrencias = await query.fetch();      
      nivel++;

      //iterando para corrigir inconsistencias da base da IN
      for (let registro of ocorrencias.rows) {
        let countFilhos = await queryVerify.clone()
          .where('CD_NVL_PRGF_CTU', 'like', `${registro.CD_NVL_PRGF_CTU}%`)
          .where('CD_NVL_PRGF_CTU', '<>', registro.CD_NVL_PRGF_CTU)
          .where('NR_NVL_PRGF_CTU', nivel)
          .getCount();

        if (registro.CD_TIP_PRGF_CTU == 2) {
          if (countFilhos) {
            //marcado como texto mas possui filhos, troca o tipo para TITULO
            registro.CD_TIP_PRGF_CTU = 1;
          }
        } else {
          if (!countFilhos) {
            //marcado como titulo mas não possui filhos, troca para TEXTO
            registro.CD_TIP_PRGF_CTU = 2;
          }
        }
      }

    } else {
      //obtem todas as ocorrencias de primeiro nivel da IN
      ocorrencias = await query
        .where('CD_TIP_PRGF_CTU', 1)
        .where('NR_NVL_PRGF_CTU', 1)
        .fetch();

      if (ocorrencias.rows.length === 0) {
          //verifica se nao retornou ocorrencias por restricao de papel das permissoes
          let queryCheckAccess = baseINCModel.query()
          .where('CD_ASNT', nroINC)
          .where('CD_TIP_CTU_ASNT', codTipoNormativo)
          .where('CD_TIP_PRGF_CTU', 1)
          .where('NR_NVL_PRGF_CTU', 1)
          .where('SG_IDI_ASNT', 'POR')
          .distinct(visibleFields)
          .orderBy('NR_ORD_PRGF_CTU')
          .setVisible(visibleFields);
             
          ocorrencias = await queryCheckAccess.fetch();
  
          if (ocorrencias.rows.length) {
            //houve supressao da informacao por falta de acesso
            //obtem os papeis que o usuario nao tem acesso para esta IN
            let papeisNecessarios = [];

            for (const code of queryNeededPermissions.rows) {
              let role = code.CD_TRAN_ACSS_CTU;
        
              if (!authorizedAccessCodes.includes(role)) {
                papeisNecessarios.push(role);
              }
            }
        
            throw new exception(`Para visualizar esta Instrução é necessário ter acesso a alguma da(s) transação(ões) a seguir: ${papeisNecessarios.join(', ')}!`, 400);
          }
        }
  
    }

    return ocorrencias;
  },

  /**
   * Retorna um item de texto da IN de acordo com os parametros informados.
   */
  findINCText: async (params) => {
    let { nroINC, codTipoNormativo, baseItem, versao } = params;

    //nao precisa verificar o codigo de acesso - faz a busca direta pela primeira ocorrencia
    let query = baseINCModel.query()
      .where('CD_ASNT', nroINC)
      .where('CD_TIP_CTU_ASNT', codTipoNormativo)
      .where('CD_NVL_PRGF_CTU', baseItem)
      .where('SG_IDI_ASNT', 'POR');

    if (versao) {
      query.where('NR_VRS_CTU_ASNT', versao)
    }

    query.setVisible([
      "CD_ASNT",
      "TX_TIT_ASNT",
      "NR_VRS_CTU_ASNT",
      "CD_TIP_CTU_ASNT",
      "TX_TIP_CTU_ASNT",
      "CD_NVL_PRGF_CTU",
      "CD_TIP_PRGF_CTU",
      "TX_TIP_PRGF",
      "NR_NVL_PRGF_CTU",
      "NR_ORD_PRGF_CTU",
      "TX_PRGF_CTU"
    ]);

    let result = await query.first();

    return result;
  },

  findINCRequiredPermissions: async (nroINC, codTipoNormativo) => {
    let queryNeededPermissions = await baseINCModel.query()
      .distinct('CD_TRAN_ACSS_CTU')
      .where('CD_ASNT', nroINC)
      .where('CD_TIP_CTU_ASNT', codTipoNormativo)
      .where('SG_IDI_ASNT', 'POR')
      .fetch();

    return queryNeededPermissions.toJSON();
  },

  /**
   * Realiza uma busca textual nos campos:
   * CD_ASNT - numero da instrucao
   * TX_TIT_ASNT - Titulo da instrucao
   */
  searchINCs: async (params) => {
    let { searchTerm } = params;

    let ocorrences = await baseINCResumidaModel.query()
    .where('CD_ASNT', 'like', `%${searchTerm}%`)
    .orWhere('TX_TIT_ASNT', 'like', `%${searchTerm}%`)
    .column({numero: 'CD_ASNT'}, {titulo: 'TX_TIT_ASNT'})
    .fetch();

    return ocorrences
  }

}