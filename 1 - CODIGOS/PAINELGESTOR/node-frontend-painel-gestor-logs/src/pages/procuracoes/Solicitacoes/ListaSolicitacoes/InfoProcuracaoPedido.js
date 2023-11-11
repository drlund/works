import React from 'react';
import { relativeDateFromToday } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Solicitacoes/relativeDateFromToday';

/**
 * @param {{
*  procuracao: Procuracoes.SolicitacoesLista.Pedido['procuracao']
* }} props
*/
export function InfoProcuracaoPedido({ procuracao }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
        Procuração do Pedido:
      </span>

      <LabelDate label='Emissão' date={procuracao.dataEmissao} />

      {Boolean(procuracao.dataManifesto) && (
        <LabelDate label='Manifesto' date={procuracao.dataManifesto} />
      )}

      {Boolean(procuracao.dataRevogacao) && (
        <LabelDate label='Revogação' date={procuracao.dataRevogacao} />
      )}

      <LabelDate label='Vencimento' date={procuracao.dataVencimento} />
    </div>
  );
}

/**
 * @param {{
*  label: string,
*  date: string,
* }} props
*/
function LabelDate({ label, date }) {
  return (
    <div>
      <span style={{ fontWeight: 'bold' }}>{`${label}: `}</span>
      {`${new Date(date).toLocaleDateString()} (${relativeDateFromToday(date)})`}
    </div>
  );
}
