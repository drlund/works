import EtapaSubsidiaria from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_SUBSIDIARIA = {
  titulo: 'Subsidiária',
  nomeCampo: 'subsidiaria',
  componente: EtapaSubsidiaria,
  validar: (dadosSubsidiaria) => new Promise((resolve, reject) => {
    if (!dadosSubsidiaria) {
      reject('Informe os dados da subsidiária');
    }
    resolve(dadosSubsidiaria);
  })
};
