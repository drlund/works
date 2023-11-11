import { FeatureFlag } from '@/components/FeatureFlag';
import { SpinningContext } from '@/components/SpinningContext';
import { Divider } from 'antd';
import { MeetingHeader } from './components/MeetingHeader';
import { PeopleCostProvider, peopleCostConstants } from './components/PeopleCostContext';
import { PesquisaContent } from './components/PesquisaContent';
import { peopleCostFlags } from './peopleCostAcessos';

function MeetingCost() {
  return (
    <FeatureFlag flagName={peopleCostFlags.costs}>
      <MeetingHeader />
      <Divider />
      <SpinningContext>
        <PesquisaContent />
      </SpinningContext>
    </FeatureFlag>
  );
}

export default () => (
  <PeopleCostProvider defaultExtra constant={peopleCostConstants.meeting}>
    <MeetingCost />
  </PeopleCostProvider>
);
