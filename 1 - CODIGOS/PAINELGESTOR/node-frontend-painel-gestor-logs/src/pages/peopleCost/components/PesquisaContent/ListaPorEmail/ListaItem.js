import { Divider, InputNumber } from 'antd';
import { toBRL } from '../../../utils/toBRL';
import { peopleCostConstants, usePeopleCost } from '../../PeopleCostContext';

/**
 * @param {{
 *  item: PeopleCost.PesquisaOk
 * }} props
 */
export function ListaItem({ item }) {
  const { constant } = usePeopleCost();

  if (constant === peopleCostConstants.meeting) {
    return <ItemMeeting item={item} />;
  }

  if (constant === peopleCostConstants.efficiency) {
    return <ItemEfficiency item={item} />;
  }

  return null;
}

/**
 * @param {{
 *  item: PeopleCost.PesquisaOk
 * }} props
 */
function ItemMeeting({ item: { valorHora, valorMinuto } }) {
  const { costCalculator, withTaxes } = usePeopleCost();

  const { totalHora, extra } = costCalculator(valorMinuto);

  const extraValue = extra ? `| Extra: ${toBRL(extra)}` : '';
  const totalHour = withTaxes ? `| Total: ${toBRL(totalHora)}` : '';

  return (
    <div>
      {`Hora Base: ${toBRL(valorHora)} ${totalHour} ${extraValue}`}
    </div>
  );
}


/**
 * @param {{
 *  item: PeopleCost.PesquisaOk
 * }} props
 */
function ItemEfficiency({ item }) {
  const { costCalculator, setListas, maxMinutes } = usePeopleCost();

  const { totalHora, totalTempo } = costCalculator(item.valorMinuto, item.projetoMinutos);

  const handleChangeTime = (/** @type {number?} */ newTime) => {
    setListas((old) => {
      const funci = /** @type {PeopleCost.PesquisaOk} */(old.funcis[item.email]);

      if (newTime) {
        funci.projetoMinutos = newTime;
      } else {
        delete funci.projetoMinutos;
      }

      return { ...old };
    });
  };

  return (
    <div style={{ display: 'flex', gap: '0.2em', alignItems: 'center', fontSize: '1.2em' }}>
      <span>
        Hora: {toBRL(totalHora)}
      </span>
      <Divider type='vertical' />
      <span>
        Total: {toBRL(totalTempo)}
      </span>
      <Divider type='vertical' />
      <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
        <InputNumber
          value={item.projetoMinutos || maxMinutes}
          onChange={handleChangeTime}
        />
        minutos no projeto
      </div>
    </div>
  );
}

