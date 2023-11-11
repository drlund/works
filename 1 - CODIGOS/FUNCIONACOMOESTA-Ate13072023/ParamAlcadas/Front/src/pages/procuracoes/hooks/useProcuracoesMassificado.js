import { useFeatureFlag } from 'components/FeatureFlag/FeatureFlagHook';
import { ProcuracaoAcessos, useProcuracoesAcessos } from './ProcuracaoAcessos';
import { ProcuracaoFlags } from './ProcuracaoFlags';

export function useProcuracoesMassificado() {
  const flag = useFeatureFlag({
    flagName: ProcuracaoFlags.massificado,
    use: 'query',
  });

  const permission = useProcuracoesAcessos(
    ProcuracaoAcessos.massificado
  );

  return flag || permission;
}
