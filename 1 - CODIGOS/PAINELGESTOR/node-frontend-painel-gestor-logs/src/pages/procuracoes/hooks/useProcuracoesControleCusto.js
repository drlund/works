import { useFeatureFlag } from 'components/FeatureFlag/FeatureFlagHook';
import { ProcuracaoFlags } from './ProcuracaoFlags';
import { ProcuracaoAcessos, useProcuracoesAcessos } from './ProcuracaoAcessos';

/**
 * Verifica se tem permissão ou flag para controle de custo
 */
export function useProcuracoesControleCusto() {
  const flag = useFeatureFlag({
    flagName: ProcuracaoFlags.controleCusto,
    use: 'query',
  });

  const permission = useProcuracoesAcessos(
    ProcuracaoAcessos.controleCusto
  );

  return flag || permission;
}
