import { Avatar, List } from 'antd';
import { getProfileURL } from '@/utils/Commons';

/**
 * @param {{
 *  funciRegistro: Procuracoes.SolicitacoesLista.FunciSolicitacoes
 * }} props
 */
export function BlocoFunciRegistro({ funciRegistro }) {
  return (
    <List.Item.Meta
      style={{ alignItems: 'center' }}
      avatar={<Avatar src={getProfileURL(funciRegistro.matricula)} />}
      title={`Registro por: ${funciRegistro.nome}`}
      description={
        <span style={{ color: 'black' }}>
          {`${funciRegistro.cargo} - ${funciRegistro.dependencia.prefixo} ${funciRegistro.dependencia.nome}`}
        </span>
      }
    />
  );
}
