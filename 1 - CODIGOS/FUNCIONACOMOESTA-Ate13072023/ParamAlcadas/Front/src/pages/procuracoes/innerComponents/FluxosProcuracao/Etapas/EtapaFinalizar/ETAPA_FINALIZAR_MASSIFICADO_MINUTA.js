import { EtapaFinalizarMassificadoMinuta } from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_FINALIZAR_MASSIFICADO_MINUTA = {
  titulo: 'Finalizar Massificado de Minuta',
  useAllData: true,
  nomeCampo: 'minutaCadastrada',
  componente: EtapaFinalizarMassificadoMinuta,
  validar: (dados) => Promise.resolve(dados)
};
