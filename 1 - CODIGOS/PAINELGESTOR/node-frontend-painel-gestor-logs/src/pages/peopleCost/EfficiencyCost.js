import { Divider } from 'antd';

import { FeatureFlag } from '@/components/FeatureFlag';
import { SpinningContext } from '@/components/SpinningContext';

import { EfficiencyHeader } from './components/EfficiencyHeader';
import { PeopleCostProvider, peopleCostConstants } from './components/PeopleCostContext';
import { PesquisaContent } from './components/PesquisaContent';
import { peopleCostFlags } from './peopleCostAcessos';

function EfficiencyCost() {
  return (
    <FeatureFlag flagName={peopleCostFlags.costs}>
      <EfficiencyHeader />
      <Divider />
      <SpinningContext>
        <PesquisaContent />
      </SpinningContext>
    </FeatureFlag>
  );
}

export default () => (
  <PeopleCostProvider defaultExtra={false} constant={peopleCostConstants.efficiency}>
    <EfficiencyCost />
  </PeopleCostProvider>
);
