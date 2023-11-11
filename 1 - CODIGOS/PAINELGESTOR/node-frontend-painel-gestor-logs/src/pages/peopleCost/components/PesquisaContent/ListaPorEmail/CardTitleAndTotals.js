import { toBRL } from '@/pages/peopleCost/utils/toBRL';
import { Divider } from 'antd';
import { peopleCostConstants, usePeopleCost } from '../../PeopleCostContext';
import { isFunciError } from './isFunciError';
import { isFunciLoading } from './isFunciLoading';

export function CardTitleAndTotals() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0 }}>Funcis</h3>
      <TotalsWrapper />
    </div>
  );
}

function TotalsWrapper() {
  const {
    source,
    constant,
  } = usePeopleCost();

  if (source.length === 0) {
    return null;
  }

  if (constant === peopleCostConstants.meeting) {
    return <TotalsMeeting />;
  }

  if (constant === peopleCostConstants.efficiency) {
    return <TotalsEfficiency />;
  }

  return null;
}

function TotalsMeeting() {
  const {
    totalHora,
    totalTempo,
    currentTotal,
  } = usePeopleCost();

  return (
    <div>
      <span>Total/Hora: {toBRL(totalHora)}</span>
      <Divider type='vertical' />
      <span>Total: {toBRL(totalTempo)}</span>
      <Divider type='vertical' />
      <span style={{ color: 'green' }}>Reunião: {toBRL(currentTotal)}</span>
    </div>
  );
}

function TotalsEfficiency() {
  const {
    source,
    costCalculator,
  } = usePeopleCost();

  const total = source.reduce((acc, funci) => {
    if (isFunciError(funci) || isFunciLoading(funci)) {
      return acc;
    }

    return costCalculator(funci.valorMinuto, funci.projetoMinutos).totalTempo + acc;
  }, 0);

  return (
    <div>
      Total: {toBRL(total)}
    </div>
  );
}
