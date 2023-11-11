import { screen, waitFor } from '@testing-library/react';
import Minuta from '..';
import { mockFluxoParticular } from '../../__mocks__/mockFluxos';
import {
  getButtonWithName,
  goToSecondStep,
  initialStepSelecionarDadosBasicos,
  startRender
} from '../../tests/utils';

describe('<Minuta> - after selecting an option and clicking continuar button', () => {
  const forFluxos = 1;
  const forListaMinuta = 1;
  const forMinutaTemplate = 1;

  beforeEach(async () => {
    await startRender(Minuta, {
      timesFetchIsCalled: forFluxos + forListaMinuta,
    });

    await initialStepSelecionarDadosBasicos(
      () => screen.getByText(mockFluxoParticular)
    );

    await goToSecondStep();

    await waitFor(() => {
      expect(globalThis.fetchSpy).toHaveBeenCalledTimes(
        forFluxos + forListaMinuta + forMinutaTemplate
      );
    });
  });

  it('renders the steps', async () => {
    const outorgadoStep = 1;
    const tituloStepOutorgado = 1;
    expect(screen.getAllByText('Outorgado')).toHaveLength(outorgadoStep + tituloStepOutorgado);
    expect(screen.getByText('Outorgante')).toBeInTheDocument();
    expect(screen.getByText('Minuta')).toBeInTheDocument();
    expect(screen.getByText('Finalizar Minuta')).toBeInTheDocument();
    expect(screen.getByText('Baixar Minuta')).toBeInTheDocument();
  });

  it('renders recomeçar button', async () => {
    expect(getButtonWithName('Recomeçar')).toBeInTheDocument();
  });
});
