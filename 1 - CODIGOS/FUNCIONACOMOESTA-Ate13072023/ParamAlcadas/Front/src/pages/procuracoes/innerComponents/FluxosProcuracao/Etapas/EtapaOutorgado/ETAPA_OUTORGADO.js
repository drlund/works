import EtapaOutorgado from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo<Funci>} */
export const ETAPA_OUTORGADO = {
  titulo: 'Outorgado',
  nomeCampo: 'outorgado',
  componente: EtapaOutorgado,
  validar: (outorgado) => new Promise((resolve, reject) => {
    if (!outorgado?.matricula) {
      reject('Informe o outorgado!');
    }
    resolve(outorgado);
  }),
};
