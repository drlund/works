import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';

import { SpinningContext } from '@/components/SpinningContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { dateToBRTimezoneString } from '@/utils/dateToBRTimezoneString';
import { renderWithRedux, toPlayground } from '@test-utils';

import { ListaControleEnvios } from '.';
import { CartorioContext } from '../../contexts/CartorioContext';
import * as CopiaFormModule from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/CopiaAutenticadaForm';
import * as ManifestoFormModule from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/ManifestoForm';
import * as RevogacaoFormModule from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Gerenciar/RevogacaoForm';

jest.setTimeout(60000);

// @ts-ignore
const copiaFormSpy = jest.spyOn(CopiaFormModule, CopiaFormModule.CopiaAutenticadaFormInner.name);

// @ts-ignore
const manifestoFormSpy = jest.spyOn(ManifestoFormModule, ManifestoFormModule.ManifestoFormInner.name);

// @ts-ignore
const revogacaoFormSpy = jest.spyOn(RevogacaoFormModule, RevogacaoFormModule.RevogacaoFormInner.name);

describe('<ListaControleEnvios>', () => {
  const baseItem = (n = 1) =>  /** @type {Procuracoes.SolicitacoesListaControle.ListaControle} */({
    digital: false,
    fisica: false,
    id: n,
    idCartorioCusto: n,
    idProcuracao: n,
    idSubsidiaria: null,
    nomeSubsidiaria: null,
    matriculaRegistroPedido: `matricula registro pedido ${n}`,
    matriculaSent: `matricula sent ${n}`,
    outorgadoMatricula: `outorgado matricula ${n}`,
    outorgadoNome: `outorgado nome ${n}`,
    pedidoOutorgadoMatricula: `pedido outorgado matricula ${n}`,
    pedidoOutorgadoNome: `pedido outorgado nome ${n}`,
    pedidoOutorgadoDependenciaPrefixo: `pedido outorgado dependencia prefixo ${n}`,
    pedidoOutorgadoDependenciaNome: `pedido outorgado dependencia nome ${n}`,
    prefixoCusto: `prefixo custo ${n}`,
    registroPedidoAt: moment().subtract(n + 1, 'day').toISOString(),
    sentAt: moment().subtract(n + 1, 'day').toISOString(),
  });

  const manifestoNumber = 1;
  const copiaNumber = 2;
  const revogacaoNumber = 3;

  const mockLista = /** @type {Procuracoes.SolicitacoesListaControle.ListaControle[]} */([
    { ...baseItem(manifestoNumber), manifesto: 1 },
    { ...baseItem(copiaNumber), copia: 1 },
    { ...baseItem(revogacaoNumber), revogacao: 1 },
  ]);

  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  beforeEach(async () => {
    await doRender();
  });

  it('renders the items', async () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(mockLista.length);
  });

  describe('the items', () => {
    it('in the manifesto', () => {
      // has info of the procuracao
      expect(screen.getByText(
        `pedido outorgado matricula ${manifestoNumber} pedido outorgado nome ${manifestoNumber} | pedido outorgado dependencia prefixo ${manifestoNumber} / pedido outorgado dependencia nome ${manifestoNumber}`
      )).toBeInTheDocument();

      // has the pedido box
      expect(screen.getByText(`matricula registro pedido ${manifestoNumber}`)).toBeInTheDocument();

      // has the enviado box
      expect(screen.getByText(`matricula sent ${manifestoNumber}`)).toBeInTheDocument();

      // has the procuracao item
      expect(screen.getByText(`outorgado matricula ${manifestoNumber} outorgado nome ${manifestoNumber}`)).toBeInTheDocument();

      // has the dates for pedido e sent
      expect(screen.getAllByText(
        // @ts-ignore
        `${dateToBRTimezoneString(moment().subtract(manifestoNumber + 1, 'day').toISOString())} (há ${manifestoNumber + 1} dias)`
      )).toHaveLength(2);

      // has the cadastrar certidão button
      expect(screen.getByRole('button', {
        name: /cadastrar certidão/i
      })).toBeInTheDocument();

      // has the cadastrar via fisica button
      expect(screen.getByRole('button', {
        name: /via física de certidão/i
      })).toBeInTheDocument();
    });

    it('in the copia', () => {
      // has info of the procuracao
      expect(screen.getByText(
        `pedido outorgado matricula ${copiaNumber} pedido outorgado nome ${copiaNumber} | pedido outorgado dependencia prefixo ${copiaNumber} / pedido outorgado dependencia nome ${copiaNumber}`
      )).toBeInTheDocument();

      // has the pedido box
      expect(screen.getByText(`matricula registro pedido ${copiaNumber}`)).toBeInTheDocument();

      // has the enviado box
      expect(screen.getByText(`matricula sent ${copiaNumber}`)).toBeInTheDocument();

      // has the procuracao item
      expect(screen.getByText(`outorgado matricula ${copiaNumber} outorgado nome ${copiaNumber}`)).toBeInTheDocument();

      // has the dates for pedido e sent
      expect(screen.getAllByText(
        // @ts-ignore
        `${dateToBRTimezoneString(moment().subtract(copiaNumber + 1, 'day').toISOString())} (há ${copiaNumber + 1} dias)`
      )).toHaveLength(2);

      // has the cadastrar copia button
      expect(screen.getByRole('button', {
        name: /cadastrar cópia autenticada/i
      })).toBeInTheDocument();
    });

    it('in the revogacao', () => {
      // has info of the procuracao
      expect(screen.getByText(
        `pedido outorgado matricula ${revogacaoNumber} pedido outorgado nome ${revogacaoNumber} | pedido outorgado dependencia prefixo ${revogacaoNumber} / pedido outorgado dependencia nome ${revogacaoNumber}`
      )).toBeInTheDocument();

      // has the pedido box
      expect(screen.getByText(`matricula registro pedido ${revogacaoNumber}`)).toBeInTheDocument();

      // has the enviado box
      expect(screen.getByText(`matricula sent ${revogacaoNumber}`)).toBeInTheDocument();

      // has the procuracao item
      expect(screen.getByText(`outorgado matricula ${revogacaoNumber} outorgado nome ${revogacaoNumber}`)).toBeInTheDocument();

      // has the dates for pedido e sent
      expect(screen.getAllByText(
        // @ts-ignore
        `${dateToBRTimezoneString(moment().subtract(revogacaoNumber + 1, 'day').toISOString())} (há ${revogacaoNumber + 1} dias)`
      )).toHaveLength(2);

      // has the cadastrar revogação button
      expect(screen.getByRole('button', {
        name: /cadastrar revogação/i
      })).toBeInTheDocument();

      // has the cadastrar via fisica button
      expect(screen.getByRole('button', {
        name: /via física de revogação/i
      })).toBeInTheDocument();
    });
  });

  it('fluxo de manifesto', async () => {
    // click trigger
    await userEvent.click(screen.getByRole('button', {
      name: /cadastrar certidão/i
    }));
    await act(() => {
      jest.runAllTimers();
    });

    // modal is visible
    expect(screen.getByText(`Certidão - outorgado matricula ${manifestoNumber} outorgado nome ${manifestoNumber}`)).toBeVisible();

    // form called with the correct values
    expect(screen.getByTestId('props').innerHTML).toEqual(JSON.stringify({
      cartorioId: manifestoNumber,
      idProcuracao: manifestoNumber,
      idSubsidiaria: null,
      prefixoCusto: `prefixo custo ${manifestoNumber}`,
      idSolicitacao: manifestoNumber,
    }));

    // on clicking what would be the submit button
    await userEvent.click(screen.getByRole('button', { name: 'postCb' }));

    // cadastrar button removed
    expect(screen.queryByRole('button', {
      name: /cadastrar certidão/i
    })).not.toBeInTheDocument();

    // trigger for cadastrar via fisica
    await userEvent.click(screen.getByRole('button', {
      name: /via física de certidão/i
    }));

    const popconfirm = screen.getByRole('tooltip', {
      name: /confirma envio de via física\?/i
    });

    // popconfirm is visible
    expect(popconfirm).toBeInTheDocument();

    // confirm envio
    await userEvent.click(within(popconfirm).getByRole('button', { name: /sim/i }));

    // cadastrar via fisica button removed
    expect(screen.queryByRole('button', {
      name: /via física de certidão/i
    })).not.toBeInTheDocument();

    // item is removed from list
    expect(screen.getAllByRole('listitem')).toHaveLength(mockLista.length - 1);

    // api was called
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
      FETCH_METHODS.PATCH,
      `/procuracoes/solicitacoes/via-fisica/${manifestoNumber}`,
    );
  });

  it('fluxo de cadastro de copia', async () => {
    // click trigger
    await userEvent.click(screen.getByRole('button', {
      name: /cadastrar cópia autenticada/i
    }));
    await act(() => {
      jest.runAllTimers();
    });

    // modal is visible
    expect(screen.getByText(`Cópia Autenticada - outorgado matricula ${copiaNumber} outorgado nome ${copiaNumber}`)).toBeVisible();

    // form called with the correct values
    expect(screen.getByTestId('props').innerHTML).toEqual(JSON.stringify({
      cartorioId: copiaNumber,
      idProcuracao: copiaNumber,
      idSubsidiaria: null,
      prefixoCusto: `prefixo custo ${copiaNumber}`,
      idSolicitacao: copiaNumber,
    }));

    // on clicking what would be the submit button
    await userEvent.click(screen.getByRole('button', { name: 'postCb' }));

    // item is removed from list
    expect(screen.getAllByRole('listitem')).toHaveLength(mockLista.length - 1);

    // cadastrar button removed
    expect(screen.queryByRole('button', {
      name: /cadastrar cópia autenticada/i
    })).not.toBeInTheDocument();
  });

  it('fluxo de revogacao', async () => {
    // click trigger
    await userEvent.click(screen.getByRole('button', {
      name: /cadastrar revogação/i
    }));
    await act(() => {
      jest.runAllTimers();
    });

    // modal is visible
    expect(screen.getByText(`Revogação - outorgado matricula ${revogacaoNumber} outorgado nome ${revogacaoNumber}`)).toBeVisible();

    // form called with the correct values
    expect(screen.getByTestId('props').innerHTML).toEqual(JSON.stringify({
      cartorioId: revogacaoNumber,
      idProcuracao: revogacaoNumber,
      prefixoCusto: `prefixo custo ${revogacaoNumber}`,
      idSolicitacao: revogacaoNumber,
    }));

    // on clicking what would be the submit button
    await userEvent.click(screen.getByRole('button', { name: 'postCb' }));

    // cadastrar button removed
    expect(screen.queryByRole('button', {
      name: /cadastrar revogação/i
    })).not.toBeInTheDocument();

    // trigger for cadastrar via fisica
    await userEvent.click(screen.getByRole('button', {
      name: /via física de revogação/i
    }));

    const popconfirm = screen.getByRole('tooltip', {
      name: /confirma envio de via física\?/i
    });

    // popconfirm is visible
    expect(popconfirm).toBeInTheDocument();

    // confirm envio
    await userEvent.click(within(popconfirm).getByRole('button', { name: /sim/i }));

    // cadastrar via fisica button removed
    expect(screen.queryByRole('button', {
      name: /via física de revogação/i
    })).not.toBeInTheDocument();

    // item is removed from list
    expect(screen.getAllByRole('listitem')).toHaveLength(mockLista.length - 1);

    // api was called
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
      FETCH_METHODS.PATCH,
      `/procuracoes/solicitacoes/via-fisica/${revogacaoNumber}`,
    );
  });

  async function doRender(lista = mockLista) {
    const mockCartorios = /** @type {Procuracoes.Cartorio[]} */([{
      id: 1,
      nome: 'mock cartorio',
    }]);

    globalThis.fetchSpy
      .mockImplementation((_, route) => {
        if (route === '/procuracoes/solicitacoes/controle') {
          return Promise.resolve(lista);
        }
        if (route === '/procuracoes/cadastro/lista-cartorios') {
          return Promise.resolve(mockCartorios);
        }
        return Promise.resolve(null);
      });

    // @ts-ignore
    copiaFormSpy.mockImplementation(MockForm);
    // @ts-ignore
    manifestoFormSpy.mockImplementation(MockForm);
    // @ts-ignore
    revogacaoFormSpy.mockImplementation(MockForm);

    renderWithRedux(
      <CartorioContext>
        <SpinningContext>
          <ListaControleEnvios />
        </SpinningContext>
      </CartorioContext>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando solicitações enviadas...')).not.toBeInTheDocument();
    });
  }
});

// @ts-ignore
function MockForm({ postCb, ...props }) {
  return (
    <div>
      <div data-testid="props">{JSON.stringify(props)}</div>
      <button type='button' onClick={postCb}>postCb</button>
    </div>
  );
}
