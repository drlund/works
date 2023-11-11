import EtapaOutorgadoMassificado from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo<{outorgados: Record<string, unknown>}>} */
export const ETAPA_OUTORGADO_MASSIFICADO = {
  titulo: 'Outorgado Massificado',
  nomeCampo: 'outorgadoMassificado',
  componente: EtapaOutorgadoMassificado,
  validar: (dados) => new Promise((resolve, reject) => {
    const arrayWithLen = Array.isArray(Object.values(dados.outorgados)) && Object.values(dados.outorgados).length > 0;
    if (!arrayWithLen) {
      reject('Informe os outorgados!');
    }
    resolve(dados);
  }),
};
