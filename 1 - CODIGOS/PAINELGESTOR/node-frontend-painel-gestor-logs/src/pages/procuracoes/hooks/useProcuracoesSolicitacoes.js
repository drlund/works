import { ProcuracaoAcessos, useProcuracoesAcessos } from './ProcuracaoAcessos';

export function useProcuracoesSolicitacoes() {
  return useProcuracoesAcessos(
    ProcuracaoAcessos.solicitacoes
  );
}
