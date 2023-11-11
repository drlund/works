import { useFeatureFlag } from '@/components/FeatureFlag/FeatureFlagHook';

export const peopleCostFlags = /** @type {const} */({
  costs: 'costs',
});

export function usePeopleCostFlag() {
  return useFeatureFlag({ flagName: peopleCostFlags.costs });
}
