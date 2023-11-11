import { useEffect, useState } from 'react';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { PesquisaItemAcordeaoContextWrapper } from '../../PesquisaItemAcordeaoContext';
import { SolicitacoesContext } from '../shared/SolicitacoesContext';
import { SolicitacoesBase } from './SolicitacoesBase';
import { EditarSolicitacoesTrigger } from './ModalSolicitacoesTrigger';

/**
 * @param {{
 *  idProcuracao: number,
 *  idPedido: Procuracoes.SolicitacoesLista.Pedido['id'],
 *  copia: number[],
 *  manifesto: number[],
 *  handleCallback: () => void,
 * }} props
 */

export function SolicitacoesEditarInner({ idProcuracao, idPedido, copia, manifesto, handleCallback }) {
  const [error, setError] = useState(false);
  const [outorgado, setOutorgado] = useState(/** @type {Procuracoes.Outorgante|null} */(null));

  useEffect(() => {
    setError(false);

    fetch(FETCH_METHODS.GET, '/procuracoes/pesquisa', {
      idProcuracao,
    })
      .then((resp) => {
        setOutorgado(/** @type {Procuracoes.Outorgante} */({ procuracao: resp }));
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (error) {
    return (
      <EditarSolicitacoesTrigger
        disabled
        loading={false}
        onClick={() => { }}
        label='Erro ao carregar dados.' />
    );
  }

  if (!outorgado) {
    return (
      <EditarSolicitacoesTrigger
        disabled={false}
        loading
        onClick={() => { }}
        label='Preparando Edição...' />
    );
  }

  return (
    <PesquisaItemAcordeaoContextWrapper outorgado={outorgado}>
      <SolicitacoesContext
        idProcuracao={idProcuracao}
        idPedido={idPedido}
      >
        <SolicitacoesBase
          observacaoPlaceholder='Coloque aqui a razão da alteração.'
          procuracaoId={idProcuracao}
          record={{ procuracaoAtiva: 1, revogacao: /** @type {string & Date} */ ('') }}
          solicitacaoType='edit'
          defaultCart={{ idPedido, manifesto, copia, observacao: null }}
          modalTrigger={EditarSolicitacoesTrigger}
          handleCallback={handleCallback} />
      </SolicitacoesContext>
    </PesquisaItemAcordeaoContextWrapper>
  );
}
