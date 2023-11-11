import EtapaOutorgante from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo<Procuracoes.Poderes>} */
export const ETAPA_OUTORGANTE = {
  titulo: 'Outorgante',
  nomeCampo: 'poderes',
  componente: EtapaOutorgante,
  validar: (outorgante) => new Promise((resolve, reject) => {
    if (!outorgante.outorganteSelecionado) {
      reject('Informe os poderes');
    }
    resolve(outorgante);
  })
};
