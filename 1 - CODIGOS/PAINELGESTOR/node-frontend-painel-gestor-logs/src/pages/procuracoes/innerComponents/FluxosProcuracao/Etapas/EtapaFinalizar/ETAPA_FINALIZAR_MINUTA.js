import { EtapaFinalizarMinuta } from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_FINALIZAR_MINUTA = {
  titulo: 'Finalizar Minuta',
  useAllData: true,
  nomeCampo: 'minutaCadastrada',
  componente: EtapaFinalizarMinuta,
  validar: (dados) => Promise.resolve(dados)
};
