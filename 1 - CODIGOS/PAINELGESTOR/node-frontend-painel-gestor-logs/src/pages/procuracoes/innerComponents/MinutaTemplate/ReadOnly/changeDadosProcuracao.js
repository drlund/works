/**
 * @typedef {Procuracoes.ProcuracoesContext['setDadosProcuracao']} setDadosProcuracao
 * @typedef {Omit<Procuracoes.DadosProcuracao['dadosMinuta']['customData'], 'massificado'>} CustomDataOneOutorgado
 * @typedef {(data: CustomDataOneOutorgado) => void} ChangeDadosClosureFunc
 * @typedef {(setDadosProcuracao: setDadosProcuracao) => ChangeDadosClosureFunc} ChangeDadosProcuracaoFunc
 * @typedef {(setDadosProcuracao: setDadosProcuracao, matricula: string) => ChangeDadosClosureFunc} ChangeDadosProcuracaoMassificadoFunc
 */

/**
 * @type {ChangeDadosProcuracaoFunc}
 */
export const changeDadosProcuracao = (setDadosProcuracao) => (data) => {
  setDadosProcuracao((old) => ({
    ...old,
    dadosMinuta: {
      ...old.dadosMinuta,
      customData: {
        ...old.dadosMinuta.customData,
        ...data
      }
    }
  }));
};

/**
 * @type {ChangeDadosProcuracaoMassificadoFunc}
 */
export const changeDadosProcuracaoMassificado = (setDadosProcuracao, matricula) => (data) => {
  setDadosProcuracao((old) => {
    const { outorgado, ...restData } = data;

    return ({
      ...old,
      dadosMinuta: {
        ...old.dadosMinuta,
        customData: {
          ...old.dadosMinuta.customData,
          ...restData,
          massificado: {
            ...old.dadosMinuta.customData.massificado,
            [matricula]: outorgado,
          }
        }
      }
    });
  });
};
