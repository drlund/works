import { Button, Popconfirm, message } from 'antd';

import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';

import { useModal } from '../../innerComponents/shared/useModal';
import { ListaProcuracoes } from './ListaProcuracoes';

/**
 * @param {{
 *  listas: import('.').ListaRevogacaoMassificada,
 *  cb: () => void
 * }} props
 */
export function ModalLoteRevogacao({ listas, cb }) {
  const { ModalContainer, closeModal } = useModal();

  const isFetching = Object.keys(listas.fetchingMatriculas).length > 0;
  const onlyErrors = Object.values(listas.outorgados).every(
    (o) => o.every((p) => /** @type {import('.').PesquisaError} */(p).error)
  );

  const triggerDisabled = isFetching || onlyErrors;

  const handleConfirm = () => {
    const revogacao = Object.values(listas.outorgados).map((o) =>
      o.filter((p) => !/** @type {import('.').PesquisaError} */(p).error)
        .map((p) => /** @type {import('.').PesquisaOk} */(p).idProcuracao)
    ).flat(Infinity).filter(Boolean);

    return fetch(
      FETCH_METHODS.POST,
      '/procuracoes/solicitacoes/massificado/lote-revogacao',
      { revogacao }
    ).then(() => {
      message.success('Lote de Revogação salvo com sucesso!');
      cb();
      closeModal();
    }).catch((/** @type {string} */ err) => {
      message.error(err || 'Erro ao salvar lote de revogação!');
    });
  };

  return (
    <ModalContainer
      buttonLabel='Confirmar Lote'
      modalTitle='Lote de Revogação'
      buttonProps={{
        type: 'primary',
        disabled: triggerDisabled,
        style: { width: '100%' },
      }}
      modalProps={{
        footer: [
          <div key='footer' style={{ display: 'flex', gap: '1em', justifyContent: 'flex-end' }}>
            <Button onClick={closeModal}>Cancelar</Button>
            <Popconfirm
              title='Confirma o lote?'
              onConfirm={handleConfirm}
            >
              <Button type='primary'>Confirmar</Button>
            </Popconfirm>
          </div>
        ]
      }}
    >
      <ListaProcuracoes listas={listas} />
    </ModalContainer>
  );
}
