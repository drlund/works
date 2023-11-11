import { clickComboBox } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Cadastrar from '..';
import { mockFluxos } from '../../__mocks__/mockFluxos';
import {
  getButtonWithName,
  getCombobox,
  startRender
} from '../../tests/utils';

it('<Cadastrar>', async () => {
  await startRender(Cadastrar);

  // renders the helper header
  expect(screen.getByText('Cadastrar Procuração')).toBeInTheDocument();

  // renders the helper
  expect(
    screen.getByText('Para cadastrar uma procuração, primeiro selecione um fluxo abaixo ou continue o cadastro a partir de uma minuta emitida.')
  ).toBeInTheDocument();

  // renders the cadastro header
  expect(screen.getByText('Selecionar dados básicos')).toBeInTheDocument();

  // renders continuar button disabled
  expect(getButtonWithName('Continuar')).toBeDisabled();

  // renders the input
  expect(getCombobox()).toBeInTheDocument();

  // input => renders the lista minutas
  expect(screen.getByRole('heading', {
    name: /ou continuar de uma minuta emitida/i
  })).toBeInTheDocument();

  // cadastro/lista de minutas => renders redirect button when empty
  expect(screen.getByRole('button', {
    name: /crie uma agora!/i
  })).toBeInTheDocument();

  // about: input options
  // when options are rendered
  await clickComboBox();

  const minutas = Object.values(mockFluxos).map(({ minuta }) => minuta);

  // renders the minutas options
  await waitFor(() => {
    minutas.forEach((minuta) => {
      expect(screen.getByText(minuta)).toBeInTheDocument();
    });
  });

  // about: cadastro/lista de minutas
  // when clicking to redirect
  await userEvent.click(screen.getByRole('button', {
    name: /crie uma agora!/i
  }));

  // redirects to minutas module
  expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
  expect(globalThis.routerDomPushMock).toHaveBeenCalledWith('/procuracoes/minuta');
});
