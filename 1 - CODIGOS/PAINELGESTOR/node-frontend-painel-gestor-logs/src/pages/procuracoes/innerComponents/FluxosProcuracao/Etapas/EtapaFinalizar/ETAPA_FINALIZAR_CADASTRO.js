import { EtapaFinalizarCadastro } from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_FINALIZAR_CADASTRO = {
  titulo: 'Finalizar Cadastramento',
  useAllData: true,
  componente: EtapaFinalizarCadastro,
  validar: () => Promise.resolve()
};
