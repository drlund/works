// necessário para testar o componente select do antd
/* eslint-disable testing-library/no-node-access */
import {
  act, screen, waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cloneDeep from 'lodash.clonedeep';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { clickComboBox, renderWithRedux, selectInDatePicker } from '@test-utils';
import { outorgadoComProcuracaoAgregada } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';

import { tiposEtapa } from '../innerComponents/FluxosProcuracao/Etapas/DadosProcuracao/tiposEtapa';
import { verificaTipoEtapa } from '../innerComponents/FluxosProcuracao/Etapas/DadosProcuracao/verificaTipoEtapa';
import * as cadastrarProcuracaoModule from '../innerComponents/FluxosProcuracao/Etapas/EtapaFinalizar/apiCalls/cadastrarProcuracao';
import { mockCartorios } from '../__mocks__/mockCartorios';
import { mockFluxos } from '../__mocks__/mockFluxos';
import { mockSubsidiarias } from '../__mocks__/mockSubsidiarias';
import { mockMinutaCadastrada } from '../__mocks__/mockMinutaCadastrada';

const cadastrarOriginalImplementation = cadastrarProcuracaoModule.cadastrarProcuracaoSuperAdm;
/** @type {jest.SpiedFunction<cadastrarProcuracaoModule.cadastrarProcuracaoSuperAdm>} */
export const cadastrarProcuracaoSpy = jest.spyOn(
  cadastrarProcuracaoModule,
  // @ts-ignore
  cadastrarProcuracaoModule.cadastrarProcuracaoSuperAdm.name
);

// por causa do nesting, alguns testes demoram muito e estouram o tempo limite
jest.setTimeout(60000);

/**
 * @param {string|RegExp} name
 */
export const getButtonWithName = (name) => screen.getByRole('button', { name });
export const getCombobox = () => screen.getByRole('combobox');

/**
 * @param {React.JSXElementConstructor<any>} Component
 * @param {{
 *  prefixo?: string,
 *  beforeRenderDefaultReturn?: unknown,
 *  beforeRender?: Function,
 *  initialEntries?: string[],
 *  routePath?: string,
 *  shouldAwaitFetch?: boolean,
 *  timesFetchIsCalled?: number,
 * }} options
 */
export async function startRender(Component, {
  prefixo = '9009',
  beforeRenderDefaultReturn = [],
  beforeRender = () => {
    globalThis.permissionHookMock.mockReturnValue(true);
    globalThis.fetchSpy.mockImplementation(
      /**
       * @param {*} _
       * @param {string} route
       */
      // @ts-ignore
      async (_, route) => {
        if (route.includes('fluxos')) {
          return mockFluxos;
        }
        // retorno para `ListaDeMinutas` (cadastro/minutas)
        return beforeRenderDefaultReturn;
      });
  },
  initialEntries = ['/'],
  routePath = '/',
  shouldAwaitFetch = true,
  timesFetchIsCalled = 2, // 1 para fluxos, 1 para lista de minutas
} = {}) {
  beforeRender();

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    renderWithRedux(
      (
        // @ts-ignore
        <MemoryRouter initialEntries={initialEntries}>
          <Switch>
            {/* @ts-ignore */}
            <Route path={routePath}>
              <Component />
            </Route>
          </Switch>
        </MemoryRouter>
      ), {
        preloadedState: {
          app: {
            authState: {
              sessionData: {
                prefixo,
              },
              token: 'mock token',
            }
          }
        }
      }
    );

    if (shouldAwaitFetch) {
      await waitFor(() => {
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(timesFetchIsCalled);
      });
    }
  });
}

/**
 * @param {() => Element} elementToClickFn
 */
export async function initialStepSelecionarDadosBasicos(elementToClickFn) {
  await clickComboBox();

  await userEvent.click(elementToClickFn());
}

export async function goToSecondStep() {
  await userEvent.click(getButtonWithName('Continuar'));

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument();
  });
}

export async function stepSelecionarCartorio() {
  await clickComboBox();

  await userEvent.click(screen.getByText(mockCartorios[0].nome));

  await userEvent.click(getButtonWithName('Próximo'));
}

export async function preStepPreencherProcuracao() {
  await waitFor(() => {
    expect(screen.getByText('Enviar arquivo')).toBeInTheDocument();
  });
}

export async function stepPreencherProcuracao(tipoEtapa = tiposEtapa.publica) {
  verificaTipoEtapa(tipoEtapa);
  await selectInDatePicker(() => screen.getByRole('textbox', { name: /data de emissão/i }), '20/03/2020');
  expect(screen.getByRole('textbox', { name: /data de emissão/i })).toHaveValue('20/03/2020');

  await selectInDatePicker(() => screen.getByRole('textbox', { name: /data de vencimento/i }), '20/03/2023');
  expect(screen.getByRole('textbox', { name: /data de vencimento/i })).toHaveValue('20/03/2023');

  if (tipoEtapa === tiposEtapa.publica) {
    await selectInDatePicker(() => screen.getByRole('textbox', { name: /data manifesto de assinaturas/i }), '20/03/2023');
    expect(screen.getByRole('textbox', { name: /data manifesto de assinaturas/i })).toHaveValue('20/03/2023');

    await userEvent.type(screen.getByRole('textbox', { name: /livro/i }), '1');
    expect(screen.getByRole('textbox', { name: /livro/i })).toHaveValue('1');

    await userEvent.type(screen.getByRole('textbox', { name: /folha/i }), '1');
    expect(screen.getByRole('textbox', { name: /folha/i })).toHaveValue('1');
  }

  // custos de cadeia são para procuracoes públicas feitas pela super
  if (screen.queryByRole('spinbutton', { name: /custo da cadeia/i })) {
    await userEvent.type(screen.getByRole('spinbutton', { name: /custo da cadeia/i }), '1', { initialSelectionStart: 0, initialSelectionEnd: Infinity });
    expect(screen.getByRole('spinbutton', { name: /custo da cadeia/i })).toHaveValue('1');

    // o cartório da cadeia pode ser diferente, hoje está fixado com id 1 por default
    expect(screen.getByText(mockCartorios.find(c => c.id === 1).nome)).toBeInTheDocument();
  }

  await userEvent.type(screen.getByRole('spinbutton', { name: /^valor/i }), '1', { initialSelectionStart: 0, initialSelectionEnd: Infinity });
  expect(screen.getByRole('spinbutton', { name: /^valor/i })).toHaveValue('1');

  await userEvent.type(screen.getByRole('spinbutton', { name: /dependência de débito/i }), '1', { initialSelectionStart: 0, initialSelectionEnd: Infinity });
  expect(screen.getByRole('spinbutton', { name: /dependência de débito/i })).toHaveValue('1');

  await userEvent.type(screen.getByPlaceholderText('Link do documento'), 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  expect(screen.getByPlaceholderText('Link do documento')).toHaveValue('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  await userEvent.click(getButtonWithName('Próximo'));
}

export async function preStepProcurarOutorgado() {
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/matrícula/i)).toBeInTheDocument();
  });
}

/**
 * @param {string} matricula
 * @param {DeepPartial<Funci>} mockOutorgado
 */
export async function stepProcurarOutorgado(matricula, mockOutorgado) {
  globalThis.fetchSpy.mockResolvedValue(mockOutorgado);

  await userEvent.type(screen.getByPlaceholderText(/matrícula/i), matricula);
  await userEvent.click(getButtonWithName('search'));

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /remover outorgado/i })).toBeInTheDocument();
  });
}

export async function preStepSelecionarSubsidiarias() {
  globalThis.fetchSpy.mockResolvedValue(mockSubsidiarias);

  await userEvent.click(getButtonWithName('Próximo'));

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /subsidiária/i })).toBeInTheDocument();
  });
}

export async function stepSelecionarSubsidiaria() {
  await clickComboBox();

  await userEvent.click(screen.getByText(mockSubsidiarias[0].nomeReduzido));

  await userEvent.click(getButtonWithName('Próximo'));

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /finalizar cadastramento/i })).toBeInTheDocument();
  });
}

export async function preStepSelecionarOutorgante() {
  await userEvent.click(getButtonWithName('Próximo'));

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /outorgante/i })).toBeInTheDocument();
  });
}

export async function stepSelecionarOutorgante(
  mock = cloneDeep([outorgadoComProcuracaoAgregada])
) {
  globalThis.fetchSpy.mockResolvedValue(mock);

  await userEvent.type(screen.getByPlaceholderText(/número do prefixo, matrícula ou nome/i), 'F1690528');
  await userEvent.click(getButtonWithName(/search buscar/i));

  await waitFor(() => {
    expect(screen.getAllByRole('tab')).toHaveLength(mock.length);
  });
}

export async function stepConfirmarSalvarMinuta() {
  globalThis.fetchSpy.mockResolvedValue(mockMinutaCadastrada);

  await userEvent.click(screen.getByRole('checkbox', {
    name: /estou de acordo com os termos acima e me comprometo a fazer o upload do substabelecimento de procuração assinado\./i
  }));

  await userEvent.click(screen.getByRole('button', {
    name: /finalizar cadastro de minuta/i
  }));

  await waitFor(() => {
    expect(screen.queryByRole('heading', { name: /finalizar minuta/i })).not.toBeInTheDocument();
  });
}

export async function finalStepSalvarProcuracao() {
  globalThis.fetchSpy.mockResolvedValue('Procuração cadastrada com sucesso');
  cadastrarProcuracaoSpy.mockImplementation(
    cadastrarOriginalImplementation
  );

  await userEvent.click(getButtonWithName(/registrar cadastro/i));

  await waitFor(() => {
    expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
  });
}

export const getPoderesCard = () => screen.getByRole('heading', {
  name: /poderes\(s\) selecionado\(s\)/i
}).parentElement.parentElement.parentElement.parentElement;

export const getProcuracoesOutorganteCard = () => screen.getByRole('heading', {
  name: /procurações do outorgante/i
}).parentElement.parentElement.parentElement.parentElement;
