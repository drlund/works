import { EtapaBaixarMinuta } from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_BAIXAR_MINUTA = {
  titulo: 'Baixar Minuta',
  useAllData: true,
  componente: EtapaBaixarMinuta,
  validar: () => Promise.resolve()
};
