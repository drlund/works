import { Tooltip } from 'antd';
import { dateToBRTimezoneString } from '@/utils/dateToBRTimezoneString';
import { StyledUl } from './StyledUl';

/**
 * @param {{
 *  items: import('.').LoteRevogacoes['items'];
 * }} props
 */
export function LoteRevogacaoItems({ items }) {
  return (<>
    <div>
      <StyledUl style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
        <li style={{ width: '50%' }}>Procuração</li>
        <li style={{ width: '12.5%' }}>Criado</li>
        <li style={{ width: '12.5%' }}>Enviado ao Cartório</li>
        <li style={{ width: '12.5%' }}>Cadastro Via Digital</li>
        <li style={{ width: '12.5%' }}>Cadastro Via Física</li>
      </StyledUl>
    </div>
    {items.map((i) => (
      <StyledUl key={i.idItem}>
        <li style={{ width: '50%' }}>{`${i.matricula} ${i.nome}`}</li>
        <Tooltip title={i.criado ? `em ${dateToBRTimezoneString(i.criado)}` : null}>
          <li style={{ width: '12.5%' }}>{i.criado ? '✅' : '☐'}</li>
        </Tooltip>
        <Tooltip title={i.cartorio ? `em ${dateToBRTimezoneString(i.cartorio)}` : null}>
          <li style={{ width: '12.5%' }}>{i.cartorio ? '✅' : '☐'}</li>
        </Tooltip>
        <Tooltip title={i.viaDigital ? `em ${dateToBRTimezoneString(i.viaDigital)}` : null}>
          <li style={{ width: '12.5%' }}>{i.viaDigital ? '✅' : '☐'}</li>
        </Tooltip>
        <Tooltip title={i.viaFisica ? `em ${dateToBRTimezoneString(i.viaFisica)}` : null}>
          <li style={{ width: '12.5%' }}>{i.viaFisica ? '✅' : '☐'}</li>
        </Tooltip>

      </StyledUl>
    ))}
  </>);
}
