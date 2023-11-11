import { getSmallerDateFromSubsidiarias } from './smallerDateFunctions';

/**
 * @param {Procuracoes.Outorgante} outorgado
 */
export function extractAcordeaoItemData(outorgado) {
  const CollapsePanelHeader = `${outorgado.matricula.trim()} - ${outorgado.nome.trim()} (${outorgado.cargoNome.trim()})`;
  const { ativo } = outorgado;

  const tableDataSource = (!outorgado.procuracao || outorgado.procuracao.length === 0)
    ? []
    : outorgado.procuracao.map(extractProcuracaoDataSource);

  return {
    ativo,
    CollapsePanelHeader,
    tableDataSource,
  };

  /**
   * @param {Procuracoes.Procuracao} procuracao
   * @param {number} index
   */
  function extractProcuracaoDataSource(procuracao, index) {
    if (procuracao.procuracaoAgregada !== null) {
      return extractProcuracaoAgregada(index, outorgado, procuracao);
    }

    return extractProcuracaoExplodida(procuracao);
  }
}

/**
 * @param {Procuracoes.Procuracao} procuracao
 */
function extractProcuracaoExplodida(procuracao) {
  const { subsidiarias, subsIds, minManifesto } = procuracao.subsidiarias
    .reduce((acc, cur) => {
      acc.subsidiarias.push(cur.nome);
      acc.subsIds.push(cur.procuracaoId);
      if (acc.minManifesto > new Date(cur.manifesto)) {
        acc.minManifesto = new Date(cur.manifesto);
      }
      return acc;
    }, {
      subsidiarias: /** @type {string[]} */ ([]),
      subsIds: /** @type {number[]} */ ([]),
      minManifesto: new Date(999999999999999)
    });

  return {
    nome: procuracao.outorgado.nome,
    matricula: procuracao.outorgado.matricula,
    cargo: procuracao.outorgado.cargo,
    subsidiarias,
    subsIds,
    manifesto: minManifesto,
    vencimento: getSmallerDateFromSubsidiarias(procuracao.subsidiarias),
    acoes: procuracao.subsidiarias.map((s) => ({
      [s.procuracaoId]: {
        doc: s.doc,
        nome: s.nome,
      }
    }))
  };
}

/**
 * @param {number} index
 * @param {Procuracoes.Outorgante} outorgado
 * @param {Procuracoes.Procuracao} procuracao
 */
function extractProcuracaoAgregada(index, outorgado, procuracao) {
  const outorgante = (index === 0 && outorgado.procuracao[index + 1])
    ? outorgado.procuracao[index + 1].outorgado
    : undefined;

  return {
    ...procuracao.procuracaoAgregada,
    outorgante,
    nome: procuracao.outorgado.nome,
    matricula: procuracao.outorgado.matricula,
    cargo: procuracao.outorgado.cargo,
    procuracaoId: procuracao.procuracaoAgregada.procuracaoId,
    subsidiarias: procuracao.subsidiarias.map(s => s.nome),
    vencimento: procuracao.procuracaoAgregada.vencimento,
    manifesto: procuracao.procuracaoAgregada.manifesto,
    acoes: [{ 'Baixar Procuracão': procuracao.procuracaoAgregada.doc }],
    raw: procuracao,
  };
}

/**
 * @typedef {ReturnType<extractProcuracaoAgregada>} extractedProcuracaoAgregadaReturnData
 * @typedef {ReturnType<extractProcuracaoExplodida>} extractedProcuracaoExplodidaReturnData
 * @typedef {ReturnType<extractAcordeaoItemData>} extractedAcordeaoItemDataReturnData
 * @typedef {extractedProcuracaoAgregadaReturnData | extractedProcuracaoExplodidaReturnData} ExtractedDataSource
 * @typedef {extractedProcuracaoAgregadaReturnData & extractedProcuracaoExplodidaReturnData} ExtractedDataSourceUnion o certo deveria ser "OU",
 * mas isso da problemas porque jsdoc tem suporte limitado a type narrowing
 * @typedef {ExtractedDataSource['acoes']} ExtractedAcoes
 */
