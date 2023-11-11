// @ts-ignore
// eslint-disable-next-line import/no-unresolved
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

describe('<Cadastrar>', () => {
  beforeEach(async () => {
    await startRender(Cadastrar);
  });

  it('renders the helper header', () => {
    expect(screen.getByText('Cadastrar Procuração')).toBeInTheDocument();
  });

  it('renders the helper', () => {
    expect(screen.getByText('Para cadastrar uma procuração, primeiro selecione um fluxo abaixo ou continue o cadastro a partir de uma minuta emitida.')).toBeInTheDocument();
  });

  it('renders the cadastro header', () => {
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
        const minutas = Object.values(mockFluxos).map(({ minuta }) => minuta);
        await waitFor(() => {
          minutas.forEach((minuta) => {
            expect(screen.getByText(minuta)).toBeInTheDocument();
          });
        });
      });
    });
  });

  it('renders the lista minutas', async () => {
    expect(screen.getByRole('heading', {
      name: /ou continuar de uma minuta emitida/i
    })).toBeInTheDocument();
  });

  describe('cadastro/lista de minutas', () => {
    it('renders redirect button when empty', async () => {
      expect(screen.getByRole('button', {
        name: /crie uma agora!/i
      })).toBeInTheDocument();
    });

    describe('when clicking to redirect', () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByRole('button', {
          name: /crie uma agora!/i
        }));
      });

      it('redirects to minutas module', async () => {
        expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
        expect(globalThis.routerDomPushMock).toHaveBeenCalledWith('/procuracoes/minuta');
      });
    });
  });
});
