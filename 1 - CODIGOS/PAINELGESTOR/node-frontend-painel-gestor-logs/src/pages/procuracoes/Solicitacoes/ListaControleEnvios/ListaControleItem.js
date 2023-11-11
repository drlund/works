import { ArrowRightOutlined } from '@ant-design/icons';
import { List } from 'antd';
import { useState } from 'react';

import { BoldLabelDisplay } from '@/components/BoldLabelDisplay/BoldLabelDisplay';

import { CopiaAutenticadaFormInner } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/CopiaAutenticadaForm';
import { ManifestoFormInner } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/ManifestoForm';
import { RevogacaoFormInner } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/RevogacaoForm';
import { AvatarByDate } from './AvatarByDate';
import { CadastrarViaFisicaButton } from './CadastrarViaFisicaButton';
import { FieldWrapper } from './FieldWrapper';
import { useModalContainer } from './ModalContainer';

/**
 * @param {{
 *  item: Procuracoes.SolicitacoesListaControle.ListaControle,
 *  handleCallback: (modalCb: () => void) => void
 * }} props
 */
export function ListaControleItem({ item, handleCallback }) {
  const [vias, setVias] = useState({ digital: item.digital, fisica: item.fisica });
  const { ModalContainer, closeModal } = useModalContainer();
  const itemText = `${item.outorgadoMatricula} ${item.outorgadoNome} ${item.nomeSubsidiaria ? `(${item.nomeSubsidiaria})` : ''}`;

  const callback = (/** @type {Partial<typeof vias>} */ newVias) => {
    const digital = newVias.digital ?? vias.digital;
    const fisica = newVias.fisica ?? vias.fisica;

    setVias(() => ({ digital, fisica }));

    if (digital && fisica) {
      return handleCallback(closeModal);
    }

    return closeModal();
  };

  return (
    <List.Item
      key={item.id}
      style={{
        border: '1px solid lightgray',
        borderRadius: '1em',
        marginBottom: '1em',
        boxShadow: 'rgba(0, 0, 0, 0.15) 8px 8px 8px 0px',
      }}
    >
      <BoldLabelDisplay label='Procuração do Pedido'>
        {
          item.pedidoOutorgadoMatricula
            ? `${item.pedidoOutorgadoMatricula} ${item.pedidoOutorgadoNome} | ${item.pedidoOutorgadoDependenciaPrefixo} / ${item.pedidoOutorgadoDependenciaNome}`
            : 'Pedido feito em lote'
        }
      </BoldLabelDisplay>

      <div style={{
        display: 'flex',
        justifyContent: 'start',
        gap: '1.5em',
        alignItems: 'center',
        marginTop: '2em',
      }}>
        <FieldWrapper label="Pedido">
          <AvatarByDate
            matricula={item.matriculaRegistroPedido}
            date={item.registroPedidoAt} />
        </FieldWrapper>

        <ArrowRightOutlined style={{ fontSize: '1.5em' }} />

        <FieldWrapper label="Enviado">
          <AvatarByDate
            matricula={item.matriculaSent}
            date={item.sentAt} />
        </FieldWrapper>

        <ArrowRightOutlined style={{ fontSize: '1.5em' }} />

        <div style={{ display: 'flex', gap: '1em', flexDirection: 'column', marginTop: '-1em' }}>
          <BoldLabelDisplay label="Procuração do Item">
            {itemText}
          </BoldLabelDisplay>

          <div style={{ display: 'flex', gap: '1em', width: '100%' }}>
            {Boolean(item.manifesto) && !vias.digital && (
              <ModalContainer
                key={`${item.id}-manifesto`}
                buttonLabel='Cadastrar Certidão'
                type='manifesto'
                modalTitle={`Certidão - ${itemText}`}
              >
                <ManifestoFormInner
                  cartorioId={item.idCartorioCusto}
                  idProcuracao={item.idProcuracao}
                  idSubsidiaria={item.idSubsidiaria}
                  prefixoCusto={item.prefixoCusto}
                  idSolicitacao={item.id}
                  postCb={() => callback({ digital: true })}
                />
              </ModalContainer>
            )}

            {Boolean(item.copia) && !vias.digital && (
              <ModalContainer
                key={`${item.id}-copia`}
                buttonLabel='Cadastrar Cópia Autenticada'
                type='copia'
                modalTitle={`Cópia Autenticada - ${itemText}`}
              >
                <CopiaAutenticadaFormInner
                  cartorioId={item.idCartorioCusto}
                  idProcuracao={item.idProcuracao}
                  idSubsidiaria={item.idSubsidiaria}
                  prefixoCusto={item.prefixoCusto}
                  idSolicitacao={item.id}
                  postCb={() => callback({ digital: true, fisica: true })}
                />
              </ModalContainer>
            )}

            {Boolean(item.revogacao) && !vias.digital && (
              <ModalContainer
                key={`${item.id}-revogacao`}
                buttonLabel='Cadastrar Revogação'
                type='revogacao'
                modalTitle={`Revogação - ${itemText}`}
              >
                <RevogacaoFormInner
                  cartorioId={item.idCartorioCusto}
                  idProcuracao={item.idProcuracao}
                  prefixoCusto={item.prefixoCusto}
                  idSolicitacao={item.id}
                  postCb={() => callback({ digital: true })}
                />
              </ModalContainer>
            )}

            {!vias.fisica && !item.copia && (
              <CadastrarViaFisicaButton
                id={item.id}
                // cópia não faz o cadastro da via fisica em separado
                label={item.revogacao ? 'Revogação' : 'Certidão'}
                postCb={() => callback({ fisica: true })}
              />
            )}
          </div>
        </div>
      </div>
    </List.Item>
  );
}
