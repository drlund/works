import { Avatar, List } from 'antd';
import { getProfileURL } from '@/utils/Commons';

/**
 * @param {{
 *  outorgado: Procuracoes.SolicitacoesLista.FunciSolicitacoes
 * }} props
 */
export function BlocoFunciOutorgado({ outorgado }) {
  return (
    <List.Item.Meta
      style={{ alignItems: 'center' }}
      avatar={<Avatar src={getProfileURL(outorgado.matricula)} />}
      title={`Para procuração de: ${outorgado.nome}`}
      description={
        <span style={{ color: 'black' }}>
          {
            `${outorgado.cargo}
              - Prefixo: ${outorgado.dependencia.prefixo} ${outorgado.dependencia.nome}
              - Super: ${outorgado.dependencia.super}`
          }
        </span>
      }
    />
  );
}
