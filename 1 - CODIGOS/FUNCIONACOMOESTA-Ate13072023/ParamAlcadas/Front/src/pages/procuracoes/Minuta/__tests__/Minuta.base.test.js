// eslint-disable-next-line import/no-unresolved
import { clickComboBox } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import Minuta from '..';
import { mockFluxoParticular, mockFluxos } from '../../__mocks__/mockFluxos';
import {
  getButtonWithName,
  getCombobox,
  initialStepSelecionarDadosBasicos,
  startRender
} from '../../tests/utils';

describe('<Minuta>', () => {
  const forFluxos = 1;
  const forListaMinuta = 1;

  beforeEach(async () => {
    await startRender(Minuta, {
      timesFetchIsCalled: forFluxos + forListaMinuta,
    });
  });

  it('renders the helper header', () => {
    expect(screen.getByRole('heading', {
      name: 'Minutas',
      level: 2
    })).toBeInTheDocument();
  });

  it('renders the helper', () => {
    expect(screen.getByText(
      'Minuta é o modelo utilizado para solicitar ao cartório a emissão de uma procuração. Para mais informações, consulte a IN 288-1.'
    )).toBeInTheDocument();
    expect(screen.getByText(
      'Ao emitir uma minuta utilizando esta ferramenta, você também poderá reutilizar os dados preenchidos para finalizar o cadastramento da procuração.'
    )).toBeInTheDocument();
  });

  it('renders the minuta header', () => {
    expect(screen.getByText('Selecionar dados básicos')).toBeInTheDocument();
  });

  it('renders continuar button disabled', () => {
    expect(getButtonWithName('Continuar')).toBeDisabled();
  });

  describe('input', () => {
    it('renders the input', () => {
      expect(getCombobox()).toBeInTheDocument();
    });

    describe('input options', () => {
      beforeEach(async () => {
        await clickComboBox();
      });

      it('renders the minutas options', async () => {
        const minutas = Object.values(mockFluxos)
          .filter((fluxo) => fluxo.fluxo !== 'SUBSIDIARIA')
          .map(({ minuta }) => minuta);
        await waitFor(() => {
          minutas.forEach((minuta) => {
            expect(screen.getByText(minuta)).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('after selecting a fluxo', () => {
    beforeEach(async () => {
      globalThis.fetchSpy.mockResolvedValue({
        templateBase: 'template'
      });
      await initialStepSelecionarDadosBasicos(() => screen.getByTitle(mockFluxoParticular));
    });

    it('renders the template wrapper', async () => {
      expect(screen.getByText(/visualização da minuta/i)).toBeInTheDocument();
    });

    it('renders the template', async () => {
      // o rich editor não tem compatibilidade com o jsdom
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('#MinutaTemplateEditor')).toBeInTheDocument();
    });
  });
});
