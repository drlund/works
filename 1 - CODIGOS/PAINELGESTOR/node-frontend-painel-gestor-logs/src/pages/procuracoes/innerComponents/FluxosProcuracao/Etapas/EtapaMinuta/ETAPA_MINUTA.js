import { EtapaMinuta } from '.';

/**
 * @typedef {{isValid: boolean;dadosEtapa: unknown;}} EtapaMinutaValidar
 * @type {Procuracoes.AllFluxosBaseFluxo<EtapaMinutaValidar, EtapaMinutaValidar['dadosEtapa']>}
 */
export const ETAPA_MINUTA = {
  titulo: 'Minuta',
  nomeCampo: 'dadosMinuta',
  componente: EtapaMinuta,
  validar: ({ isValid, dadosEtapa }) => new Promise((resolve, reject) => {
    if (!isValid) {
      reject('Preencha os campos necessários!');
    }
    resolve(dadosEtapa);
  })
};
