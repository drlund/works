import { useState } from 'react';

import { EditarSolicitacoesTrigger, PesquisaSolicitacoesTrigger } from './ModalSolicitacoesTrigger';
import { SolicitacoesBase } from './SolicitacoesBase';
import { SolicitacoesEditarInner } from './SolicitacoesEditarInner';

/**
 * @param {{
 *  procuracaoId: number,
 *  record: import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function SolicitacoesPesquisa({ procuracaoId, record }) {
  const placeholder = `Coloque aqui a razão do pedido.\nAviso: os pedidos são verificados e podem ser alterados ou mesmo cancelados.`;

  return (
    <SolicitacoesBase
      observacaoPlaceholder={placeholder}
      procuracaoId={procuracaoId}
      record={record}
      solicitacaoType='nova'
      defaultCart={{ manifesto: [], copia: [], observacao: null }}
      modalTrigger={PesquisaSolicitacoesTrigger}
    />
  );
}

/**
 * @param {{
 *  idProcuracao: number,
 *  idPedido: Procuracoes.SolicitacoesLista.Pedido['id'],
 *  items: Procuracoes.SolicitacoesLista.SolicitacaoItem[],
 *  handleCallback: () => void,
 * }} props
 */
export function SolicitacoesEditar({ idProcuracao, idPedido, items, handleCallback }) {
  const [prepare, setPrepare] = useState(false);

  const { manifesto, copia } = items.reduce((acc, cur) => {
    if (cur.copia) {
      acc.copia.push(cur.procuracao.id);
    }
    if (cur.manifesto) {
      acc.manifesto.push(cur.procuracao.id);
    }

    return acc;
  },
  /** @type {{ manifesto: number[], copia: number[] }} */({ manifesto: [], copia: [] })
  );

  const isRevogacao = (manifesto.length + copia.length) === 0;
  if (isRevogacao) {
    return null;
  }

  if (!prepare) {
    return (
      <EditarSolicitacoesTrigger
        disabled={false}
        loading={false}
        onClick={() => setPrepare(true)}
        label='Preparar Edição'
        ghost
      />
    );
  }

  return (
    <SolicitacoesEditarInner
      idProcuracao={idProcuracao}
      idPedido={idPedido}
      copia={copia}
      manifesto={manifesto}
      handleCallback={handleCallback}
    />
  );
}
