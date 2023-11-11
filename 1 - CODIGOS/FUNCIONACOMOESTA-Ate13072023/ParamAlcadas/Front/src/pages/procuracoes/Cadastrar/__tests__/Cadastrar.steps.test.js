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

describe('<Cadastrar> - after selecting an option and clicking continuar button', () => {
  beforeEach(async () => {
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
  });

  it('renders the steps', async () => {
    const cartorioStep = 1;
    const tituloStepCartorio = 1;
    expect(screen.getAllByText('Cartório')).toHaveLength(cartorioStep + tituloStepCartorio);
    expect(screen.getByText('Procuração Pública de Subsidiária')).toBeInTheDocument();
    expect(screen.getByText('Outorgado')).toBeInTheDocument();
    expect(screen.getByText('Subsidiária')).toBeInTheDocument();
    expect(screen.getByText('Finalizar Cadastramento')).toBeInTheDocument();
  });

  it('renders recomeçar button', async () => {
    expect(getButtonWithName('Recomeçar')).toBeInTheDocument();
  });
});
