/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import {
  render, screen, waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import { PesquisaComponent } from './PesquisaComponent';

describe('<PesquisaComponent />', () => {
  const handlePesquisaMock = jest.fn();

  describe('on default render', () => {
    beforeEach(async () => {
      render(
        <PesquisaComponent
          handlePesquisa={handlePesquisaMock}
        />
      );
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveFocus();
      });
    });

    it('render the instructions text', () => {
      expect(
        screen.getByText('Informe a matrícula, nome do funcionário ou prefixo desejado para pesquisar')
      ).toBeInTheDocument();
    });

    it('renders the search button', () => {
      expect(screen.getByRole('button')).toHaveTextContent('Buscar');
    });

    it('starts with focus on the input', () => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('render the input with a placeholder', () => {
      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Número do prefixo, matrícula ou nome');
    });
  });

  describe('when the user inputs a search', () => {
    const mockReturnFromFetch = 'test';
    const inputValue = '123456789';

    beforeEach(async () => {
      // @ts-ignore
      globalThis.fetchSpy.mockResolvedValue(mockReturnFromFetch);
      render(
        <PesquisaComponent
          handlePesquisa={handlePesquisaMock}
          showAll
        />
      );
      await userEvent.type(screen.getByRole('textbox'), inputValue);
    });

    it('has the input value', async () => {
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(inputValue);
      });
    });

    describe('when the user clicks the search button', () => {
      it('has the button disabled', async () => {
        userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
          expect(screen.getByRole('button')).toBeDisabled();
        });
      });

      it('has the input disabled', async () => {
        userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
          expect(screen.getByRole('textbox')).toBeDisabled();
        });
      });

      describe('when the API call finishes', () => {
        beforeEach(async () => {
          await userEvent.click(screen.getByRole('button'));
        });

        it('reenables the button', () => {
          expect(screen.getByRole('button')).toBeEnabled();
        });

        it('reenables the input', () => {
          expect(screen.getByRole('textbox')).toBeEnabled();
        });

        it('gives focus back to the input', () => {
          expect(screen.getByRole('textbox')).toHaveFocus();
        });

        it('has called the API with the correct parameters', () => {
          expect(globalThis.fetchSpy).toHaveBeenCalledTimes(1);
          expect(globalThis.fetchSpy).toHaveBeenCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: inputValue, maisRecente: false, ativo: 1 });
        });

        it('has called the handlePesquisa with the correct parameters', () => {
          expect(handlePesquisaMock).toHaveBeenCalledTimes(1);
          expect(handlePesquisaMock).toHaveBeenCalledWith(mockReturnFromFetch);
        });
      });
    });
  });

  describe('error paths', () => {
    const lengthErrorMessage = 'É necessário adicionar uma pesquisa.';
    const mockReturnFromFetchReject = 'error test';

    beforeEach(() => {
      render(
        <PesquisaComponent
          handlePesquisa={handlePesquisaMock}
          showAll
        />
      );
    });

    it('has no length error message', () => {
      expect(screen.queryByText(lengthErrorMessage)).not.toBeInTheDocument();
    });

    describe('when the user inputs less than 4 characters', () => {
      const inputValue = '123';
      beforeEach(async () => {
        await userEvent.type(screen.getByRole('textbox'), inputValue);
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
          screen.getByText(lengthErrorMessage);
        });
      });

      it('renders the error', () => {
        const errorElement = screen.getByText(lengthErrorMessage);
        expect(errorElement).toBeInTheDocument();
      });

      it('has the danger antd class', () => {
        const errorElement = screen.getByText(lengthErrorMessage);
        expect(errorElement).toHaveClass('ant-typography-danger');
      });

      it('didnt call the API', () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(0);
      });

      it('didnt call the handlePesquisa', () => {
        expect(handlePesquisaMock).toHaveBeenCalledTimes(0);
      });
    });

    it('has no reject error message', () => {
      expect(screen.queryByText(mockReturnFromFetchReject)).not.toBeInTheDocument();
    });

    describe('should show error when an error happens with fetch', () => {
      const inputValue = '123456789';
      beforeEach(async () => {
        // @ts-ignore
        globalThis.fetchSpy.mockRejectedValue(mockReturnFromFetchReject);
        await userEvent.type(screen.getByRole('textbox'), inputValue);
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
          screen.getByText(mockReturnFromFetchReject);
        });
      });

      it('renders the error message', () => {
        expect(screen.getByText(mockReturnFromFetchReject)).toBeInTheDocument();
      });

      it('has called the API with the correct parameters', () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(1);
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: inputValue, maisRecente: false, ativo: 1 });
      });

      it('didnt call the handlePesquisa', () => {
        expect(handlePesquisaMock).toHaveBeenCalledTimes(0);
      });
    });
  });
});
