import { EtapaBaixarMinutaMassificado } from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_BAIXAR_MINUTA_MASSIFICADO = {
  titulo: 'Baixar Minuta',
  useAllData: true,
  componente: EtapaBaixarMinutaMassificado,
  validar: () => Promise.resolve()
};
