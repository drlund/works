import { clickComboBox } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Minuta from '..';
import { mockFluxoParticular, mockFluxos } from '../../__mocks__/mockFluxos';
import {
  getButtonWithName,
  getCombobox,
  startRender
} from '../../tests/utils';

it('<Minuta>/base', async () => {
  const forFluxos = 1;
  const forListaMinuta = 1;

  await startRender(Minuta, {
    timesFetchIsCalled: forFluxos + forListaMinuta,
  });

  // renders the helper header
  expect(screen.getByRole('heading', {
    name: 'Minutas',
    level: 2
  })).toBeInTheDocument();

  // renders the helper
  expect(screen.getByText(
    'Minuta é o modelo utilizado para solicitar ao cartório a emissão de uma procuração. Para mais informações, consulte a IN 288-1.'
  )).toBeInTheDocument();
  expect(screen.getByText(
    'Ao emitir uma minuta utilizando esta ferramenta, você também poderá reutilizar os dados preenchidos para finalizar o cadastramento da procuração.'
  )).toBeInTheDocument();

  // renders the minuta header
  expect(screen.getByText('Selecionar dados básicos')).toBeInTheDocument();

  // renders continuar button disabled
  expect(getButtonWithName('Continuar')).toBeDisabled();

  // input
  // renders the input
  expect(getCombobox()).toBeInTheDocument();

  // input options
  await clickComboBox();

  // renders the minutas options
  const minutas = Object.values(mockFluxos)
    .filter((fluxo) => fluxo.fluxo !== 'SUBSIDIARIA')
    .map(({ minuta }) => minuta);
  await waitFor(() => {
    minutas.forEach((minuta) => {
      expect(screen.getByText(minuta)).toBeInTheDocument();
    });
  });

  // after selecting a fluxo
  globalThis.fetchSpy.mockResolvedValue({
    templateBase: 'template'
  });

  // @ts-ignore
  await userEvent.click(screen.getByTitle(mockFluxoParticular));

  // renders the template wrapper
  expect(screen.getByText(/visualização da minuta/i)).toBeInTheDocument();

  // renders the template
  // o rich editor não tem compatibilidade com o jsdom
  // eslint-disable-next-line testing-library/no-node-access
  expect(document.querySelector('#MinutaTemplateEditor')).toBeInTheDocument();
});
