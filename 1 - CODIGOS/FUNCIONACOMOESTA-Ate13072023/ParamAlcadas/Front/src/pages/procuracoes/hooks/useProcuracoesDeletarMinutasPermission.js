import { useProcuracoesAcessos, ProcuracaoAcessos } from './ProcuracaoAcessos';

export function useProcuracoesDeletarMinutasPermission() {
  return useProcuracoesAcessos(
    ProcuracaoAcessos.deletarMinutas
  );
}
