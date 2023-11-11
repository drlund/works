import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';

/**
 * @param {string} matricula
 * @returns {Partial<Procuracoes.DadosProcuracao>}
 */
export const extractDadosProcuracao = (matricula) => {
  const {
    dadosProcuracao: {
      outorgadoMassificado, dadosMinuta, ...restDadosProcuracao
    }
  } = useCadastroProcuracao();
  const { customData } = dadosMinuta;

  return {
    ...restDadosProcuracao,
    outorgado: /** @type {Funci} */ (outorgadoMassificado.outorgados[matricula]),
    dadosMinuta: {
      ...dadosMinuta,
      idMinuta: outorgadoMassificado.uuidMatriculas[matricula],
      customData: {
        ...customData,
        outorgado: customData.massificado?.[matricula],
      }
    }
  };
};
