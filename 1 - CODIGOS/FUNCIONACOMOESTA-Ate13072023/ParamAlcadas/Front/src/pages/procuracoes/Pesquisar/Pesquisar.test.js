import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux } from '@test-utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import Pesquisar from '.';
import { extractAcordeaoItemData } from '../innerComponents/AcordeaoProcuracoes/helpers/extractAcordeaoItemData';
import { outorgadoComProcuracaoCompleta } from '../innerComponents/AcordeaoProcuracoes/__mocks__/mockData';

describe('<Pesquisar />', () => {
  describe('on default render', () => {
    beforeEach(() => {
      renderWithRedux(
        <Pesquisar />
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
        globalThis.fetchSpy.mockResolvedValue([outorgadoComProcuracaoCompleta]);
        await userEvent.type(screen.getByRole('textbox'), inputValue);
        await userEvent.click(screen.getByRole('button'));
      });

      it('return focus to input component', () => {
        expect(screen.getByRole('textbox')).toHaveFocus();
      });

      it('calls the API', () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(2);
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: inputValue, maisRecente: false });
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
