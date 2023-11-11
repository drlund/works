import { screen, waitFor } from '@testing-library/react';
import { mockCartorios } from 'pages/procuracoes/__mocks__/mockCartorios';
import Cadastrar from '..';
import { mockFluxoSubsidiaria } from '../../__mocks__/mockFluxos';
import {
  getButtonWithName,
  initialStepSelecionarDadosBasicos,
  goToSecondStep,
  startRender
} from '../../tests/utils';

it('<Cadastrar> - after selecting an option and clicking continuar button', async () => {
  await startRender(Cadastrar);

  await initialStepSelecionarDadosBasicos(
    () => screen.getByText(mockFluxoSubsidiaria)
  );

  globalThis.fetchSpy.mockResolvedValue(mockCartorios);
  await goToSecondStep();

  await waitFor(() => {
    // lista de fluxos, lista de minutas, cartorios
    expect(globalThis.fetchSpy).toHaveBeenCalledTimes(3);
  });

  // renders the steps
  const cartorioStep = 1;
  const tituloStepCartorio = 1;
  expect(screen.getAllByText('Cartório')).toHaveLength(cartorioStep + tituloStepCartorio);
  expect(screen.getByText('Procuração Pública de Subsidiária')).toBeInTheDocument();
  expect(screen.getByText('Outorgado')).toBeInTheDocument();
  expect(screen.getByText('Subsidiária')).toBeInTheDocument();
  expect(screen.getByText('Finalizar Cadastramento')).toBeInTheDocument();

  // renders recomeçar button
  expect(getButtonWithName('Recomeçar')).toBeInTheDocument();
});
