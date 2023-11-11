import { Checkbox, InputNumber } from 'antd';
import { usePeopleCost } from './PeopleCostContext';

export function EfficiencyHeader() {
  const {
    setWithTaxes,
    withTaxes,
    setMaxMinutes,
    maxMinutes,
  } = usePeopleCost();

  return (<>
    <h3>Quanto vai custar o seu Projeto?</h3>
    <p>Coloque os participantes, ajuste os tempos e veja o custo.</p>
    <p>Os custos são apenas o valor de referência baseado nos dias úteis do mês.</p>
    <div style={{ display: 'flex', gap: '1em' }}>
      <div>
        <p>Considerar impostos.</p>
        <Checkbox
          checked={withTaxes}
          onChange={({ target: { checked } }) => { setWithTaxes(checked); }}
        >
          Adicionar 60% de Impostos
        </Checkbox>
      </div>
      <div>
        <p>Base de tempo em minutos</p>
        <div style={{ display: 'flex', gap: '0.2em', alignItems: 'center' }}>
          <InputNumber
            value={maxMinutes}
            onChange={(value) => { setMaxMinutes(value || 60); }} />
          <span>minutos base aplicado a todos</span>
        </div>
      </div>
    </div>
  </>);
}
