import { Checkbox } from 'antd';
import { usePeopleCost } from '../PeopleCostContext';

export function MeetingTexts() {
  const {
    setWithTaxes, withTaxes, setWithExtra, withExtra,
  } = usePeopleCost();

  return (<>
    <h3>Quanto vai custar a sua reunião?</h3>
    <p>Coloque os participantes, ajuste o tempo da reunião e veja o custo.</p>
    <p>Os custos são apenas o valor de referência baseado nos dias úteis do mês.</p>
    <div>
      <p>Mas existem outros custos que podemos considerar, por exemplo impostos.</p>
      <Checkbox
        checked={withTaxes}
        onChange={({ target: { checked } }) => { setWithTaxes(checked); }}
      >
        Adicionar 60% de Impostos
      </Checkbox>
    </div>
    <div>
      <p>Outra coisa a considerar é a interupção do trabalho.</p>
      <p>
        Podemos considerar como 15 minutos antes onde pouco é começado ou mesmo
        feito em antecipação e depois, mais 15 minutos para retomar o fluxo de trabalho.
      </p>
      <Checkbox
        checked={withExtra}
        onChange={({ target: { checked } }) => { setWithExtra(checked); }}
      >
        Considerar 30 minutos extras de interupção do trabalho (a 50% do valor)
      </Checkbox>
    </div>
  </>);
}
