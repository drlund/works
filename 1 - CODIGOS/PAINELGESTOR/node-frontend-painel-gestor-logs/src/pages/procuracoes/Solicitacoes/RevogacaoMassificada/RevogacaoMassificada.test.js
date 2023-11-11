/* eslint-disable no-lone-blocks */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { RevogacaoMassificada } from '.';

jest.setTimeout(60000);

describe('RevogacaoMassificada', () => {
  const mockFluxos = /** @type {Procuracoes.Fluxos} */({
    'idFluxo 0': {
      idFluxo: 'idFluxo 0',
      minuta: 'mock minuta 0',
      fluxo: 'PUBLICA',
    },
    'idFluxo 1': {
      idFluxo: 'idFluxo 1',
      minuta: 'mock minuta 1',
      fluxo: 'PUBLICA',
    },
  });

  it(' ', async () => {
    // setup
    {
      globalThis.fetchSpy
        // fluxos
        .mockResolvedValueOnce(mockFluxos)
        // lista revogacoes
        .mockResolvedValue([]);

      render(<RevogacaoMassificada />);

      await waitFor(() => {
        expect(screen.queryByText(/carregando lista de revogações\.\.\./i)).not.toBeInTheDocument();
      });
    }

    const triggerButton = screen.getByRole('button', {
      name: /criar lote de revogação/i
    });

    // renders trigger button
    expect(triggerButton).toBeInTheDocument();

    // click trigger button
    await userEvent.click(triggerButton);

    // renders a modal
    expect(screen.getByRole('dialog', {
      name: /revogação massificada/i
    })).toBeInTheDocument();

    const getAddFromPesquisaButton = () => screen.getByRole('button', {
      name: /adicionar de pesquisa/i
    });

    // the modal
    {
      // add by pesquisa
      expect(screen.getByText(/revogação massificada/i)).toBeInTheDocument();
      expect(getAddFromPesquisaButton()).toBeInTheDocument();

      // add multiple by copy paste
      expect(screen.getByPlaceholderText(/lista de matrículas/i)).toBeInTheDocument();

      // add one by one
      expect(screen.getByPlaceholderText(/uma matrícula \('f' é opcional\)/i)).toBeInTheDocument();

      // disabled confirm button
      expect(screen.getByRole('button', {
        name: /confirmar lote/i
      })).toBeDisabled();
    }

    const makeMockFromPesquisa = (/** @type {number} */ n) =>  /** @type {import('.').PesquisaOk} */({
      matricula: `F${n.toString().repeat(7)}`,
      nome: `nome ${n}`,
      idProcuracao: n,
      idFluxo: `idFluxo ${n}`,
      dataEmissao: new Date().toISOString(),
      dataVencimento: new Date().toISOString(),
    });

    // add by pesquisa
    const mockFromPesquisa = [makeMockFromPesquisa(1), makeMockFromPesquisa(2)];
    globalThis.fetchSpy.mockResolvedValue(mockFromPesquisa);

    await userEvent.click(getAddFromPesquisaButton());

    const getListItemsLength = () => within(
      // @ts-ignore
      screen.getAllByRole('list')[0]
    )
      .getAllByRole('listitem')
      // inside each item theres another that is the remove button
      .length / 2;

    // from pesquisa
    {
      // button disabled
      expect(getAddFromPesquisaButton()).toBeDisabled();

      // api was called
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.GET,
        'procuracoes/solicitacoes/massificado/revogacao/lista-revogar',
      );

      // renders list items
      expect(getListItemsLength()).toBe(mockFromPesquisa.length);

      // shows totals
      screen.getByText(/total: 2/i);
      screen.getByText(/ok: 2/i);

      // confirm lote button enabled
      expect(screen.getByRole('button', {
        name: /confirmar lote/i
      }));

      // first item
      {
        const inValueRendered0 = within(
          // @ts-ignore
          screen.getAllByRole('listitem')[0]
        );

        // image
        expect(inValueRendered0.getByRole('img', {
          name: new RegExp(`${makeMockFromPesquisa(1).nome}`, 'i')
        })).toBeInTheDocument();
        // matricula - name
        expect(inValueRendered0.getByText(
          new RegExp(`${makeMockFromPesquisa(1).matricula} - ${makeMockFromPesquisa(1).nome}`, 'i')
        )).toBeInTheDocument();
        // tipo minuta
        expect(inValueRendered0.getByText(
          // @ts-ignore
          new RegExp(`tipo: ${mockFluxos[makeMockFromPesquisa(1).idFluxo].minuta}`, 'i')
        )).toBeInTheDocument();
        // remove button
        expect(inValueRendered0.getByRole('button', {
          name: /remover/i
        }));
      }
    }

    // on removing a item
    {
      await userEvent.click(
        within(
          // @ts-ignore
          screen.getAllByRole('listitem')[0]
        )
          .getByRole('button', {
            name: /remover/i
          })
      );

      // item is removed
      expect(getListItemsLength()).toBe(mockFromPesquisa.length - 1);

      // totals updated
      screen.getByText(/total: 1/i);
      screen.getByText(/ok: 1/i);
    }

    // on adding one item
    // (re adding removed one)
    {
      globalThis.fetchSpy.mockResolvedValue([makeMockFromPesquisa(1)]);
      await userEvent.type(screen.getByPlaceholderText(/lista de matrículas/i), 'F1111111 {ENTER}');

      // calls the api
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.GET,
        'procuracoes/solicitacoes/massificado/revogacao/lista',
        { matriculas: ['F1111111'] }
      );

      // updates list
      expect(getListItemsLength()).toBe(mockFromPesquisa.length);
      expect(screen.getByText(/total: 2/i));
      expect(screen.getByText(/ok: 2/i));
    }

    // on confirming lote
    {
      await userEvent.click(screen.getByRole('button', {
        name: /confirmar lote/i
      }));

      const confirmModal = screen.getAllByRole('dialog')[1];
      // renders a new modal
      expect(confirmModal).toBeInTheDocument();

      // renders the items to confirm
      expect(
        // @ts-ignore
        within(confirmModal)
          .getAllByRole('listitem').length / 2
      ).toBe(mockFromPesquisa.length);

      // click to confirm lote
      await userEvent.click(
        // @ts-ignore
        within(confirmModal).getByRole('button', {
          name: /confirmar/i
        })
      );

      // shows popconfirm
      const popconfirm = screen.getByRole('tooltip', {
        name: /confirma o lote\?/i
      });

      expect(popconfirm).toBeInTheDocument();

      // click to confirm
      await userEvent.click(within(popconfirm).getByRole('button', { name: /ok/i }));

      // calls the api
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.POST,
        '/procuracoes/solicitacoes/massificado/lote-revogacao',
        {
          // 1 removed then added again
          revogacao: mockFromPesquisa.map((p) => p.idProcuracao).reverse()
        }
      );
    }

  });
});
