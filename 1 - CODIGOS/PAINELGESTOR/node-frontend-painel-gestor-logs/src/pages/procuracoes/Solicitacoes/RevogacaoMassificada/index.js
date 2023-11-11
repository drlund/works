import { PlusSquareOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

import { SpinningContext } from '@/components/SpinningContext';

import ProcuracoesContextWrapper from '../../contexts/ProcuracoesContext';
import { useModal } from '../../innerComponents/shared/useModal';
import { ListaRevogacoesMassificada } from './ListaRevogacoesMassificada';
import { RevogacaoMassificadaContent } from './RevogacaoMassificadaContent';

export function RevogacaoMassificada() {
  const { ModalContainer } = useModal();

  return (<>
    {/* @ts-expect-error - fluxos usados apenas no cadastro/minuta */}
    <ProcuracoesContextWrapper fluxoProcesso={undefined}>
      <ModalContainer
        buttonLabel='Criar Lote de Revogação'
        modalTitle='Revogação Massificada'
        buttonProps={{
          type: 'primary',
          icon: <PlusSquareOutlined style={{ fontSize: '1.5em', margin: '0.5rem', display: 'flex' }} />,
          style: { height: '100%', display: 'flex', alignItems: 'center', borderRadius: '20px', fontSize: '1.2em' },
        }}
        modalProps={{
          width: '90%',
        }}
      >
        <RevogacaoMassificadaContent />
      </ModalContainer>
    </ProcuracoesContextWrapper>
    <Divider />
    <SpinningContext>
      <ListaRevogacoesMassificada />
    </SpinningContext>
  </>);
}


/**
 * @typedef {{
 *  idProcuracao: number;
 *  idFluxo: string;
 *  dataEmissao: string;
 *  dataVencimento: string;
 *  matricula: string;
 *  nome: string;
 * }} PesquisaOk
 *
 * @typedef {{
 *  matricula: string;
 *  error: string;
 * }} PesquisaError
 *
 * @typedef {{
 *  matricula: string;
 *  loading: boolean;
 * }} PesquisaLoading
 *
 * @typedef {(PesquisaOk | PesquisaError)[]} PesquisaFetched
 * @typedef {PesquisaOk | PesquisaError | PesquisaLoading} Pesquisa
 *
 * @typedef {Object} ListaRevogacaoMassificada
 * @property {Record<string,PesquisaFetched>} outorgados salva os outorgados para uso
 * @property {Record<string,string[]>} fetchingMatriculas temp para evitar fetchs repetidos
 */
