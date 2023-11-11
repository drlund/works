import { getProfileURL } from '@/utils/Commons';
import { dateToBRTimezoneString } from '@/utils/dateToBRTimezoneString';
import { Avatar } from 'antd';
import { relativeDateFromToday } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Solicitacoes/relativeDateFromToday';

/**
 * @param {{
 *  matricula: string,
 *  date: string|Date,
 * }} props
 */
export function AvatarByDate({ matricula, date }) {
  return <div style={{ display: 'flex', gap: '0.5em', alignItems: "center" }}>
    <Avatar src={getProfileURL(matricula)} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>{matricula}</div>
      <div>{`${dateToBRTimezoneString(date)} (${relativeDateFromToday(date)})`}</div>
    </div>
  </div>;
}
