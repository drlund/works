'use strict'

const exception = use("App/Exceptions/Handler"),
      Database = use('Database'),
      db = Database.connection('pgBacenProcedentes'),
      dbDipes = Database.connection('dipes'),
      TB_BACEN = 'ovd.bacenprocedencia',      
      _ = use('lodash'),
      jsonExport = use('App/Commons/JsonExport');

const ACTION_COUNT_DIRETORIA = 'ACTION_COUNT_DIRETORIA',
      ACTION_COUNT_URV_SUPER = 'ACTION_COUNT_URV_SUPER',
      ACTION_COUNT_UAV_SUPER = 'ACTION_COUNT_UAV_SUPER',
      ACTION_COUNT_URV_GEREV = 'ACTION_COUNT_URV_GEREV',
      ACTION_COUNT_UAV_GEREV = 'ACTION_COUNT_UAV_GEREV',
      ACTION_MOTIVOS_BACEN = 'ACTION_MOTIVOS_BACEN';

const VISAO_DIRETORIA = 'VISAO_DIRETORIA',
      VISAO_SUPER = 'VISAO_SUPER',
      VISAO_GEREV = 'VISAO_GEREV',
      VISAO_MOTIVOS_BACEN = 'VISAO_MOTIVOS_BACEN';

const PREFIXO_URV = '9220',
      PREFIXO_UAV = '9270',
      PREFIXO_DIVAR = '8592';

class BacenProcedentesController {
  find({ request }) {
    const { action, ano } = request.allParams();

    if (!action) {
      throw new exception("Erro nos parâmetros informados para a busca de dados.", 400);
    }

    if (action === 'GET_YEAR') {
      return this.getAno();
    } else {
      if (!ano) {
        throw new exception("Ano não informado!", 400);
      }
  
      return this.getBacenProcedentes(request.allParams());
    }
  }

  getParamsQuery(params) {
    const { periodo, ano, action, mesRef, prefixo } = params;
    let result = { select1: '', col1: '', col2: '' },
        inicio = '01',
        fim = '12',
        meses = [];

    const labelMes = { '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', '05': 'mai', '06': 'jun',
                       '07': 'jul', '08': 'ago', '09': 'set', '10': 'out', '11': 'nov', '12': 'dez' };

    switch (periodo) {
      case '1T':
        meses = ['01', '02', '03'];
      break;
      case '2T':
        meses = ['04', '05', '06'];
      break;
      case '3T':
        meses = ['07', '08', '09'];
      break;
      case '4T':
        meses = ['10', '11', '12'];
      break;
      case '1S':
        meses = ['01', '02', '03', '04', '05', '06'];
      break;
      case '2S':
        meses = ['07', '08', '09', '10', '11', '12'];
      break;
      default:
        meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];    
    }

    inicio = _.first(meses);
    fim = _.last(meses);

    if (mesRef) {
      if (mesRef === 'total') {
        result.where = `to_char(dt_julgamento, 'YYYYMM') Between '${ano}${inicio}' and '${ano}${fim}'`;  
      } else {
        const mes = _.findKey(labelMes, (value) => {return value === mesRef});
        result.where = `to_char(dt_julgamento, 'YYYYMM') = '${ano}${mes}'`;
      }

      if (action === ACTION_COUNT_DIRETORIA) {
        result.where += (prefixo === PREFIXO_DIVAR) ? ` and cd_gestorfato in (${PREFIXO_DIVAR}, ${PREFIXO_UAV}, ${PREFIXO_URV})` : ` and cd_gestorfato = ${prefixo}`;
      } else if (_.some([ACTION_COUNT_UAV_SUPER, ACTION_COUNT_URV_SUPER], (item) => {return item === action})) {
        result.where += (prefixo === '0') ? ` and (cd_superfato = ${prefixo} or cd_superfato is null)` : ` and cd_superfato = ${prefixo}`;
      } else if (_.some([ACTION_COUNT_UAV_GEREV, ACTION_COUNT_URV_GEREV], (item) => {return item === action})) {
        result.where += ` and cd_suregfato = ${prefixo}`;
      } else if (action === ACTION_MOTIVOS_BACEN) {
        result.where += ` and tx_motivobacen = '${prefixo}'`;
      }
    } else {
      result.where = `to_char(dt_julgamento, 'YYYYMM') Between '${ano}${inicio}' and '${ano}${fim}'`;
  
      // Monta a primeira parte do select
      result.select1 =  (action === ACTION_MOTIVOS_BACEN) ? "tx_motivobacen as motivo" : "pref_dep as prefixo, '' as dependencia";
  
      // Monta o select com somatório de cada mês
      meses.forEach((mes) => {
        result.col1 += `cast(sum(Case When mes${mes} isnull Then 0 Else mes${mes} End) as integer) as ${labelMes[mes]},`;
      });
  
      // Montar o campo total do select
      meses.forEach((mes) => {
        if (mes == inicio) {
          result.col1 += `cast(sum(Case When mes${mes} isnull Then 0 Else mes${mes} end)`;
        } else if (mes == fim) {
          result.col1 += ` + sum(Case When mes${mes} isnull Then 0 Else mes${mes} end) as integer) as total`;
        } else {
          result.col1 += ` + sum(Case When mes${mes} isnull Then 0 Else mes${mes} end)`;
        }      
      });
  
      if (action === ACTION_COUNT_DIRETORIA) {
        result.col2 += `(Case When cd_gestorfato = ${PREFIXO_URV} or cd_gestorfato = ${PREFIXO_UAV} Then ${PREFIXO_DIVAR} Else cd_gestorfato End) as pref_dep`;

        if (prefixo) {
          result.where += (prefixo === PREFIXO_DIVAR) ? ` and cd_gestorfato in (${PREFIXO_DIVAR}, ${PREFIXO_UAV}, ${PREFIXO_URV})` : ` and cd_gestorfato = ${prefixo}`;
        }
      } else if (_.some([ACTION_COUNT_UAV_SUPER, ACTION_COUNT_URV_SUPER], (item) => {return item === action})) {
        result.col2 += "(Case When (cd_superfato = 0 or cd_superfato is null) Then 0 Else cd_superfato End) as pref_dep";

        if (prefixo) {
          result.where += (prefixo === '0') ? ` and (cd_superfato = ${prefixo} or cd_superfato is null)` : ` and cd_superfato = ${prefixo}`;
        }
      } else if (_.some([ACTION_COUNT_UAV_GEREV, ACTION_COUNT_URV_GEREV], (item) => {return item === action})) {
        result.col2 += "(Case When (cd_suregfato = 0 or cd_suregfato is null) Then 0 Else cd_suregfato End) as pref_dep";
        result.where += ' and cd_suregfato <> 0 and cd_suregfato is not null';

        if (prefixo) {
          result.where += ` and cd_suregfato = ${prefixo}`;
        }
      } else if (action === ACTION_MOTIVOS_BACEN) {
        result.col2 = 'tx_motivobacen';

        if (prefixo) {
          result.where += ` and tx_motivobacen = '${prefixo}'`;
        }
      }
          
      meses.forEach((mes) => {
        result.col2 = (result.col2) ? result.col2 + ',' : result.col2;
        result.col2 += `(Case When to_char(dt_julgamento, 'YYYYMM') = '${ano}${mes}' Then 1 End) as mes${mes}`
      });
  
      // Monta o group by
      result.group_by =  (action === ACTION_MOTIVOS_BACEN) ? 'tx_motivobacen' : 'pref_dep';
    }
    
    if (_.some([ACTION_COUNT_URV_SUPER, ACTION_COUNT_URV_GEREV], (item) => {return item === action})) {
      result.where += ` and cd_gestorfato = ${PREFIXO_URV}`;
    } else if (_.some([ACTION_COUNT_UAV_SUPER, ACTION_COUNT_UAV_GEREV], (item) => {return item === action})) {
      result.where += ` and cd_gestorfato = ${PREFIXO_UAV}`;
    } else if (action === ACTION_MOTIVOS_BACEN) {
      result.where += ` and cd_gestorfato in (${PREFIXO_UAV}, ${PREFIXO_URV})`;
    }

    return result;
  }

  async getBacenProcedentes(params) {
    const { action, mesRef } = params;
    const paramsQuery = this.getParamsQuery(params);
    
    let auxWhere = `tx_inativo = 'N' and ${paramsQuery.where}`;

    if (mesRef) {
      return await db.select(
                        Database.raw(
                          "cd_depefato || ' - ' || tx_depefato as responsavel, cd_suregfato as gerev, cd_superfato as super," +
                          "cd_gestorfato as unidade, cd_ocorrencia as ocorrencia, tx_motivobacen as motivo"
                        )
                      )
                     .from(TB_BACEN)
                     .whereRaw(auxWhere);
    }
  
    let qryResult = await db.raw(
      `SELECT ${paramsQuery.select1}, ${paramsQuery.col1} ` +
      'FROM (' +
      '   SELECT' +
      `       ${paramsQuery.col2}` +
      `   FROM ${TB_BACEN} ` +
      `   WHERE ${auxWhere}` +
      ') AS t1 ' +
      `GROUP BY ${paramsQuery.group_by} ` +
      'ORDER BY total DESC'
    );

    if (action !== ACTION_MOTIVOS_BACEN) {
      const arrayPrefixos = _.map(qryResult.rows, 'prefixo');
      
      let arrayDep = await dbDipes.select('prefixo', 'nome').from('mst606').whereIn('prefixo', arrayPrefixos).where('cd_subord', '00');
      arrayDep = _.mapKeys(arrayDep, (row) => {return row.prefixo});
  
      const result = qryResult.rows.map((row) => {
      if(!row.prefixo) {
          row.dependencia = 'CRBB';
        } else if (row.prefixo === 9999) {
          row.dependencia = 'OUVIDORIA EXTERNA';
        } else {
          row.dependencia = arrayDep[row.prefixo].nome;
        }
  
        return row;
      });

      return result;
    }

    return qryResult.rows;
  }

  async getAno() {
    return await db.distinct(Database.raw("to_char(dt_julgamento, 'YYYY') as ano")).from(TB_BACEN).orderBy('ano');
  }

  async exportarDados({ request, response }) {
    try {
      let dadosExport = await this.getBacenProcedentes(request.allParams());
      let tmpHeader = Object.keys(dadosExport[0]);
      let headers = [];

      for (const tmp of tmpHeader) {
        headers.push({ key: tmp, header: _.capitalize(tmp) })
      }
      
      let arquivoExportado = await jsonExport.convert({
        dadosJson: dadosExport, 
        headers, 
        type: "xls"
      });
  
      await jsonExport.download( response, arquivoExportado );
    } catch (err) {
      throw new exception("Falha ao exportar os dados", 400);
    }
  }
}

module.exports = BacenProcedentesController
