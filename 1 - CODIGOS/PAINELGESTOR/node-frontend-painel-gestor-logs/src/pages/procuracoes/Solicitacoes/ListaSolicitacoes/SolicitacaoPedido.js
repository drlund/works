import { Tag } from 'antd';

import { displayDateBR } from '@/utils/dateFunctions/displayDateBR';

import { relativeDateFromToday } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Solicitacoes/relativeDateFromToday';
import { isRevogacaoDeParticular } from './isRevogacao';

/**
 * @param {{
 *  item: Procuracoes.SolicitacoesLista.Pedido
 * }} props
 */
export function SolicitacaoPedido({ item }) {
  const sortedItems = [...item.solicitacaoItems]
    .sort((a, b) => a.procuracao.id - b.procuracao.id);

  return (<>
    <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '0.5em' }}>
      Pedido (em {displayDateBR(item.registroAt)} | {relativeDateFromToday(item.registroAt)}):
    </div>
    <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
      {sortedItems
        .map(i => (
          <li key={i.id} style={i.revogacao ? { color: '#A4040A', fontWeight: 'bold' } : {}}>
            {i.procuracao.outorgado.nome}
            {i.procuracao.subsidiarias.length === 1
              ? (
                <>
                  {'- '}
                  <span style={{ textDecoration: 'underline', textUnderlineOffset: '0.1em' }}>
                    {i.procuracao.subsidiarias[0]}
                  </span>
                </>
              )
              : null
            }
            {' - '}
            {i.copia ? <Tag color='geekblue'>Cópia</Tag> : null}
            {i.manifesto ? <Tag color='purple'>Certidão</Tag> : null}
            {i.revogacao ? <Tag color='#A4040A'>Revogação {isRevogacaoDeParticular(item) ? '- Procuração Particular' : ''}</Tag> : null}
          </li>
        ))}
    </ol>
  </>);
}
