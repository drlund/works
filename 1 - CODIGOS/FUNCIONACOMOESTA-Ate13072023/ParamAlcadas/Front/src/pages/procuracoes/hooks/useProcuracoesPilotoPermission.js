import { ProcuracaoAcessos, useProcuracoesAcessos } from './ProcuracaoAcessos';

export function useProcuracoesPilotoPermission() {
  return useProcuracoesAcessos(
    ProcuracaoAcessos.piloto
  );
}
