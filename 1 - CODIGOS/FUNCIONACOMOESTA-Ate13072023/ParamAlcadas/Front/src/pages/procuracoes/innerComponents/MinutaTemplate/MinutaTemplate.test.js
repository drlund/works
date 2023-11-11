import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { doMockRichEditor } from 'components/richeditor/__mocks__/RichEditorMock';
import { getFluxoComIdFluxo, mockFluxoParticular } from 'pages/procuracoes/__mocks__/mockFluxos';
import { mockOutorgadoDemaisGerentes } from 'pages/procuracoes/__mocks__/mockOutorgado';
import { outorgadoComProcuracaoAgregada, outorgadoComProcuracaoNaoAgregada } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { getButtonWithName } from 'pages/procuracoes/tests/utils';

import { MinutaTemplateEditavel, MinutaTemplateShowData, MinutaTemplateShowTemplate } from '.';
import { templateMock } from '../../Minuta/__mocks__/templateMock';
import { changeDadosProcuracao } from './ReadOnly/changeDadosProcuracao';

const { mockRichEditorInstante, mockEditorWrappers } = doMockRichEditor();

const dadosProcuracaoAgregadaMock = /** @satisfies {Partial<Procuracoes.DadosProcuracao>} */ ({
  dadosMinuta: templateMock,
  outorgado: mockOutorgadoDemaisGerentes,
  poderes: {
    outorgantes: [outorgadoComProcuracaoAgregada],
    outorganteSelecionado: /** @type {Procuracoes.DadosProcuracao['poderes']['outorganteSelecionado']} */({
      idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
      idProxy: outorgadoComProcuracaoAgregada.idProxy,
      nome: outorgadoComProcuracaoAgregada.nome,
      matricula: outorgadoComProcuracaoAgregada.matricula,
      subsidiariasSelected: outorgadoComProcuracaoAgregada
        .procuracao[0]
        .subsidiarias
        .map(({ id }) => id),
    }),
  },
  tipoFluxo: getFluxoComIdFluxo(mockFluxoParticular),
});

const dadosProcuracaoNaoAgregadaMock = /** @satisfies {Partial<Procuracoes.DadosProcuracao>} */ ({
  dadosMinuta: templateMock,
  outorgado: mockOutorgadoDemaisGerentes,
  poderes: {
    outorgantes: [outorgadoComProcuracaoNaoAgregada],
    outorganteSelecionado: /** @type {Procuracoes.DadosProcuracao['poderes']['outorganteSelecionado']} */ ({
      idProcuracao: outorgadoComProcuracaoNaoAgregada.idProcuracao,
      idProxy: outorgadoComProcuracaoNaoAgregada.idProxy,
      nome: outorgadoComProcuracaoNaoAgregada.nome,
      matricula: outorgadoComProcuracaoNaoAgregada.matricula,
      subsidiariasSelected: outorgadoComProcuracaoNaoAgregada
        .procuracao[0]
        .subsidiarias
        .map(({ id }) => id),
    }),
  },
  tipoFluxo: getFluxoComIdFluxo(mockFluxoParticular),
});

const mockCallback = jest.fn();

const getMockEditor = () => /** @type {HTMLInputElement} */(screen.getByTestId('MockRichEditor'));
const mockTemplateBase = '<p>Mock: <strong style="color: red;" data-display="mockFieldDisplay" data-minuta="mockField">mockTextPlaceholder</strong></p>';

describe('<MinutaTemplateShowData>', () => {
  /**
   * @param {{
   *  templateBase: string,
  *  initialData: Partial<Procuracoes.DadosProcuracao>
   * }} props
   */
  function WrapperMinutaTemplateShowData({ templateBase, initialData }) {
    const [dados, setDados] = useState(initialData);

    return (
      <MemoryRouter>
        <MinutaTemplateShowData
          templateBase={templateBase}
          dadosProcuracao={dados}
          callback={mockCallback}
          changeDadosProcuracao={changeDadosProcuracao(setDados)}
          editable
        />
      </MemoryRouter>
    );
  }

  describe('on default render', () => {
    beforeEach(() => {
      globalThis.permissionHookMock.mockReturnValue(true);

      render(
        <WrapperMinutaTemplateShowData
          initialData={dadosProcuracaoAgregadaMock}
          templateBase={mockTemplateBase}
        />
      );
    });

    it('renders the template component', async () => {
      expect(screen.getByText('Visualização da Minuta')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Editar Minuta' })).toBeInTheDocument();
      expect(getMockEditor()).toBeInTheDocument();
    });

    it('calls the callback function on init', async () => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith({
        isValid: false,
        template: mockTemplateBase,
      });
    });

    it('calls the functions on init', async () => {
      expect(mockEditorWrappers.extraInit_setupWrapper).toHaveBeenCalledTimes(1);
      expect(mockEditorWrappers.onBlurWrapper).toHaveBeenCalledTimes(0);
      expect(mockEditorWrappers.onChangeWrapper).toHaveBeenCalledTimes(0);
      expect(mockEditorWrappers.onInitWrapper).toHaveBeenCalledTimes(1);
    });

    describe('when dealing with templates', () => {
      describe('when opening the modal to edit fields', () => {
        const getInputsInModal = () => {
          const [, inputFromData, inputFromUser] = screen.getAllByRole('textbox');

          return {
            inputFromData,
            inputFromUser,
          };
        };

        beforeEach(async () => {
          await userEvent.click(getButtonWithName('Editar Minuta'));
        });

        it('renders the modal', async () => {
          expect(screen.getByText('Edição dos dados da minuta')).toBeInTheDocument();
          expect(screen.getByText('Edite as informações das minutas caso seja necessário.')).toBeInTheDocument();
          expect(screen.getByText('Se houver campos sem informações, estes são obrigatórios.')).toBeInTheDocument();
        });

        it('renders the header for the table in the modal', async () => {
          expect(screen.getByText('Nome do Campo')).toBeInTheDocument();
          expect(screen.getByText('Valor de base')).toBeInTheDocument();
          expect(screen.getByText('Valor a ser usado')).toBeInTheDocument();
        });

        it('renders the row for the fields', async () => {
          expect(screen.getByText('mockFieldDisplay')).toBeInTheDocument();
          expect(getInputsInModal().inputFromData).toBeDisabled();
          expect(getInputsInModal().inputFromUser).toBeEnabled();
        });

        describe('when filling a value in the modal', () => {
          const newMockFieldValue = 'new mock value';

          beforeEach(async () => {
            await userEvent.type(getInputsInModal().inputFromUser, newMockFieldValue);
          });

          it('fills the input', async () => {
            expect(getInputsInModal().inputFromUser).toHaveDisplayValue(newMockFieldValue);
          });

          describe('when confirming changes', () => {
            const updatedTemplate = mockTemplateBase
              .replace('mockTextPlaceholder', newMockFieldValue)
              .replace('red', 'black')
              .replace('data-minuta', 'data-minuta-ok');

            beforeEach(async () => {
              await userEvent.click(getButtonWithName('Confirmar'));
            });

            it('calls the callback', async () => {
              expect(mockCallback).toHaveBeenLastCalledWith({
                isValid: true,
                template: updatedTemplate,
              });
            });

            it('closes the modal', async () => {
              expect(screen.queryByText('Edição dos dados da minuta')).not.toBeVisible();
            });

            it('updates the editor value', async () => {
              expect(mockRichEditorInstante.setContent).toHaveBeenCalledTimes(2);
              expect(mockRichEditorInstante.value.at(-1)).toEqual(updatedTemplate);
              expect(getMockEditor()).toHaveDisplayValue(updatedTemplate);
            });
          });
        });
      });
    });
  });

  describe('on render with templates with all values already in dadosProcuracacao', () => {
    const mockTemplateBaseWithMoreFields = `
      <p>idTemplate: <strong style="color: green;" data-display="mockIdTemplateDisplay" data-minuta-blocked="idTemplate">mockIdTemplatePlaceholder</strong></p>
      <p>MinutaNome: <strong style="color: red;" data-display="mockMinutaDisplay" data-minuta="tipoFluxo.minuta">mockMinutaPlaceholder</strong></p>
      <p>OutorgadoMatricula: <strong style="color: red;" data-display="mockMatriculaDisplay" data-minuta="outorgado.matricula">mockMatriculaPlaceholder</strong></p>
      <p>OutorgadoNome: <strong style="color: red;" data-display="mockNomeDisplay" data-minuta="outorgado.nome">mockNomePlaceholder</strong></p>
      <p>OutorganteMatricula: <strong style="color: red;" data-display="mockMatriculaDisplay" data-minuta="outorgante.matricula">mockMatriculaPlaceholder</strong></p>
      <p>OutorganteNome: <strong style="color: red;" data-display="mockNomeDisplay" data-minuta="outorgante.nome">mockNomePlaceholder</strong></p>
    `;

    beforeEach(() => {
      render(
        <WrapperMinutaTemplateShowData
          initialData={dadosProcuracaoNaoAgregadaMock}
          templateBase={mockTemplateBaseWithMoreFields}
        />
      );
    });

    it('renders the template with replaced values', async () => {
      const mockRichEditorValue = getMockEditor().value;
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>idTemplate: <strong style="color: black;" data-display="mockIdTemplateDisplay" data-minuta-blocked-ok="idTemplate">mock id template</strong></p>'
        )
      );
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>MinutaNome: <strong style="color: black;" data-display="mockMinutaDisplay" data-minuta-ok="tipoFluxo.minuta">2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Particular</strong></p>'
        )
      );
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>OutorgadoMatricula: <strong style="color: black;" data-display="mockMatriculaDisplay" data-minuta-ok="outorgado.matricula">F6173159</strong></p>'
        )
      );
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>OutorgadoNome: <strong style="color: black;" data-display="mockNomeDisplay" data-minuta-ok="outorgado.nome">LEANDRO FERRAZ CAVALCANTE</strong></p>'
        )
      );
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>OutorganteMatricula: <strong style="color: black;" data-display="mockMatriculaDisplay" data-minuta-ok="outorgante.matricula">F1111113</strong></p>'
        )
      );
      expect(mockRichEditorValue).toEqual(
        expect.stringContaining(
          '<p>OutorganteNome: <strong style="color: black;" data-display="mockNomeDisplay" data-minuta-ok="outorgante.nome">Teste3</strong></p>'
        )
      );
    });

    describe('when replacing a value from data', () => {
      describe('when opening the modal to edit fields', () => {
        const getInputsInModal = () => {
          const [, firstInputFromData, firstInputFromUser] = screen.getAllByRole('textbox');

          return {
            firstInputFromData,
            firstInputFromUser,
          };
        };

        beforeEach(async () => {
          await userEvent.click(getButtonWithName('Editar Minuta'));
        });

        it('dont render the row for idTemplate', async () => {
          expect(screen.queryByText('mockIdTemplateDisplay')).not.toBeInTheDocument();
        });

        it('renders the row for the fields', async () => {
          expect(screen.getByText('mockMinutaDisplay')).toBeInTheDocument();
          expect(getInputsInModal().firstInputFromData).toBeDisabled();
          expect(getInputsInModal().firstInputFromUser).toBeEnabled();
        });

        describe('when filling a value in the modal', () => {
          const newMockFieldValue = 'new mock value';

          beforeEach(async () => {
            await userEvent.type(getInputsInModal().firstInputFromUser, newMockFieldValue);
          });

          it('fills the input', async () => {
            expect(getInputsInModal().firstInputFromUser).toHaveDisplayValue(newMockFieldValue);
          });

          describe('when confirming changes', () => {
            beforeEach(async () => {
              await userEvent.click(getButtonWithName('Confirmar'));
            });

            it('calls the callback', async () => {
              expect(mockCallback).toHaveBeenLastCalledWith({
                isValid: true,
                template: expect.stringContaining(
                  '<p>MinutaNome: <strong style="color: black;" data-display="mockMinutaDisplay" data-minuta-ok="tipoFluxo.minuta">new mock value</strong></p>'
                ),
              });
            });

            it('closes the modal', async () => {
              expect(screen.queryByText('Edição dos dados da minuta')).not.toBeVisible();
            });

            it('updates the editor value', async () => {
              expect(mockRichEditorInstante.setContent).toHaveBeenCalledTimes(2);
              const mockRichEditorValue = getMockEditor().value;
              expect(mockRichEditorValue).toEqual(
                expect.stringContaining(
                  '<p>idTemplate: <strong style="color: black;" data-display="mockIdTemplateDisplay" data-minuta-blocked-ok="idTemplate">mock id template</strong></p>'
                )
              );
              expect(mockRichEditorValue).toEqual(
                expect.stringContaining(
                  '<p>MinutaNome: <strong style="color: black;" data-display="mockMinutaDisplay" data-minuta-ok="tipoFluxo.minuta">new mock value</strong></p>'
                )
              );
            });
          });
        });
      });
    });
  });
});

describe('<MinutaTemplateShowTemplate>', () => {
  beforeEach(() => {
    render((
      <MinutaTemplateShowTemplate
        templateBase={mockTemplateBase}
      />
    ));
  });

  it('renders the template component', async () => {
    expect(screen.getByText('Visualização da Minuta')).toBeInTheDocument();
    expect(getMockEditor()).toBeInTheDocument();
  });

  it('renders the template', async () => {
    expect(getMockEditor().value).toEqual(mockTemplateBase);
  });
});

describe('<MinutaTemplateEditavel>', () => {
  const mockTemplateOutput = '<p>Mock: \r\n<strong style="color: red;" data-display="mockFieldDisplay" data-minuta="mockField">mockTextPlaceholder</strong>\r\n</p>';
  const mockFieldsMap = { mock1: 'mock1', mock2: 'mock2' };

  beforeEach(() => {
    render((
      <MinutaTemplateEditavel
        templateBase={mockTemplateBase}
        callback={mockCallback}
        fieldsMap={mockFieldsMap}
      />
    ));
  });

  it('renders the template component', async () => {
    expect(screen.getByText('Criação do Template')).toBeInTheDocument();
    expect(getMockEditor()).toBeInTheDocument();
  });

  it('calls the RichEditor instance functions on init', async () => {
    expect(mockRichEditorInstante.insertContent).toHaveBeenCalledTimes(0);
    expect(mockRichEditorInstante.setContent).toHaveBeenCalledTimes(0);
    expect(mockRichEditorInstante.getContent).toHaveBeenCalledTimes(0);
    const resetButtons = 1;
    const fieldButtons = Object.keys(mockFieldsMap).length;
    expect(mockRichEditorInstante.ui.registry.addButton).toHaveBeenCalledTimes(resetButtons + fieldButtons);
  });

  it('calls the callback function on init', async () => {
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      isValid: false,
      template: mockTemplateOutput,
    });
  });

  it('calls the functions on init', async () => {
    expect(mockEditorWrappers.extraInit_setupWrapper).toHaveBeenCalledTimes(1);
    expect(mockEditorWrappers.onBlurWrapper).toHaveBeenCalledTimes(0);
    expect(mockEditorWrappers.onChangeWrapper).toHaveBeenCalledTimes(0);
    expect(mockEditorWrappers.onInitWrapper).toHaveBeenCalledTimes(1);
  });

  describe('when inputting more values', () => {
    const mockTypeText = 'any text';
    beforeEach(async () => {
      await userEvent.click(getMockEditor());
      await userEvent.keyboard(mockTypeText);
    });

    it('inputs the string', async () => {
      expect(getMockEditor()).toHaveFocus();
      expect(getMockEditor()).toHaveDisplayValue(mockTemplateBase + mockTypeText);
    });

    it('calls the onChange method', async () => {
      expect(mockEditorWrappers.onBlurWrapper).toHaveBeenCalledTimes(0);
      expect(mockEditorWrappers.onChangeWrapper).toHaveBeenCalledTimes(mockTypeText.length);
    });

    describe('when leaving the input', () => {
      beforeEach(async () => {
        await userEvent.tab();
      });

      it('calls the onBlur event', async () => {
        expect(getMockEditor()).not.toHaveFocus();

        expect(mockEditorWrappers.onBlurWrapper).toHaveBeenCalledTimes(1);
        expect(mockRichEditorInstante.getContent).toHaveBeenCalledTimes(1);
      });

      it('calls the callback function', async () => {
        const firstRender = 1;
        const onBlur = 1;
        const newEditorKey = 1;
        expect(mockCallback).toHaveBeenCalledTimes(firstRender + onBlur + newEditorKey);
        expect(mockCallback).toHaveBeenLastCalledWith({
          isValid: false,
          template: mockTemplateOutput + mockTypeText,
        });
      });
    });
  });
});
