import { EtapaMinutaMassificado } from '.';

/**
 * @typedef {{isValid: boolean;dadosEtapa: unknown;}} EtapaMinutaValidar
 * @type {Procuracoes.AllFluxosBaseFluxo<EtapaMinutaValidar, EtapaMinutaValidar['dadosEtapa']>}
 */
export const ETAPA_MINUTA_MASSIFICADO = {
  titulo: 'Minuta',
  nomeCampo: 'dadosMinuta',
  componente: EtapaMinutaMassificado,
  validar: ({ isValid, dadosEtapa }) => new Promise((resolve, reject) => {
    if (!isValid) {
      reject('Preencha os campos necessários!');
    }
    resolve(dadosEtapa);
  })
};
