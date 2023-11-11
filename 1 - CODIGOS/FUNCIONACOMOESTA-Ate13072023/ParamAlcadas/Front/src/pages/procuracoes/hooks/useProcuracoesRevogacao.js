import { useFeatureFlag } from 'components/FeatureFlag/FeatureFlagHook';
import { ProcuracaoFlags } from './ProcuracaoFlags';

export function useProcuracoesControleCusto() {
  return useFeatureFlag({
    flagName: ProcuracaoFlags.revogacao,
  });
}
