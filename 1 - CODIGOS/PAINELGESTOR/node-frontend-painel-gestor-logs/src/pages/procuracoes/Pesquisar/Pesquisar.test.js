import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithRedux } from '@test-utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import Pesquisar from '.';
import { outorgadoComProcuracaoCompleta } from '../innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { extractAcordeaoItemData } from '../innerComponents/AcordeaoProcuracoes/helpers/extractAcordeaoItemData';

jest.setTimeout(60000);

describe('<Pesquisar />', () => {
  describe('on default render', () => {
    beforeEach(() => {
      // chamada para gerenciar/acessos
      globalThis.fetchSpy.mockResolvedValue([9009]);
      renderWithRedux(
        <Pesquisar />,
        { withMemoryRouter: true }
      );
    });

    it('starts with gerenciar/acessos API call', () => {
      expect(globalThis.fetchSpy).toHaveBeenCalledTimes(1);
      expect(globalThis.fetchSpy).toHaveBeenCalledWith(FETCH_METHODS.GET, 'procuracoes/gerenciar/acessos');
    });

    it('renders the PesquisaComponent', () => {
      expect(screen.getByText('Pesquisar por procuração cadastrada')).toBeInTheDocument();
    });

    it('dont render the Accordion Component', () => {
      expect(screen.queryByText('Procurações cadastradas')).not.toBeInTheDocument();
    });

    describe('when the user searchs something', () => {
      const inputValue = '123456789';

      beforeEach(async () => {
        // @ts-ignore
        globalThis.fetchSpy
          // chamada da pesquisa
          .mockResolvedValueOnce([outorgadoComProcuracaoCompleta])
          // chamada das solicitacoes
          .mockRejectedValue({});
        await userEvent.type(screen.getByRole('textbox'), inputValue);
        await userEvent.click(screen.getByRole('button', { name: /buscar/i }));
      });

      it('return focus to input component', () => {
        expect(screen.getByRole('textbox')).toHaveFocus();
      });

      it('calls the API to search', () => {
        const acesso = 1;
        const pesquisa = 1;
        const solicitacoes = 1;
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(acesso + pesquisa + solicitacoes);
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: inputValue, maisRecente: false, ativo: 1 });
      });

      it('renders the accordion', () => {
        expect(screen.getByText('Procurações cadastradas')).toBeInTheDocument();
      });

      it('renders the first panel of the accordion with a table', () => {
        // @ts-ignore
        const { CollapsePanelHeader } = extractAcordeaoItemData(outorgadoComProcuracaoCompleta);
        expect(screen.getByText(CollapsePanelHeader)).toBeInTheDocument();
      });
    });
  });
});
