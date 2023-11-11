import { useEffect } from 'react';
import * as RichEditorModule from '../RichEditor';

const value = /** @type {string[]} */([]);

const mockRichEditorInstante = {
  ui: {
    registry: {
      addButton: jest.fn(),
    }
  },
  insertContent: jest.fn(),
  setContent: jest.fn(),
  getContent: jest.fn(),
  value,
};

const mockEditorWrappers = {
  onInitWrapper: jest.fn(),
  onChangeWrapper: jest.fn(),
  onBlurWrapper: jest.fn(),
  extraInit_setupWrapper: jest.fn(),
};

/**
 * Mock para uso em testes.
 *
 * Da maneira que o TinyMCE é feito, ele não funciona com o jsdom.
 * A alternativa seria usar algo como Cypress que usa um browser de verdade.
 *
 * O mock feito é parcial para testar aquilo que estava sendo importante.
 * Alterações no Componente deveriam ser atualizadas aqui.
 * @param {{
 *  disabled?: boolean,
 *  extraInit?: {
 *    setup?: (args: any) => void
 *  },
 *  id: string,
 *  initialValue?: string
 *  onBlur?: () => void
 *  onChange?: () => void
 *  onInit?: () => void
 * }} [props]
 */
function RichEditorMock({
  disabled = false,
  extraInit: {
    setup,
  } = {},
  id,
  initialValue = '',
  onBlur = undefined,
  onChange = undefined,
  onInit = undefined,
} = /** @type {any} */ ({})) {
  const mockSetup = mockEditorWrappers.extraInit_setupWrapper.mockImplementation(setup);
  const mockOnBlur = mockEditorWrappers.onBlurWrapper.mockImplementation(onBlur);
  const mockOnChange = mockEditorWrappers.onChangeWrapper.mockImplementation(onChange);
  const mockOnInit = mockEditorWrappers.onInitWrapper.mockImplementation(onInit);

  mockRichEditorInstante.getContent
    .mockReturnValue(mockRichEditorInstante.value.at(-1));
  mockRichEditorInstante.setContent
    .mockImplementation((val) => { mockRichEditorInstante.value.push(val); });

  useEffect(() => {
    if (setup) {
      mockSetup(mockRichEditorInstante);
    }
    mockOnInit(undefined, mockRichEditorInstante);
  }, []);

  return (
    <input
      data-testid="MockRichEditor"
      id={id}
      defaultValue={initialValue || mockRichEditorInstante.value.at(-1)}
      onBlur={() => mockOnBlur({ target: mockRichEditorInstante })}
      onChange={({ target }) => {
        mockRichEditorInstante.value.push(target.value);
        mockOnChange({ target });
      }}
      disabled={disabled}
    />
  );
}

const richEditorSpy = jest.spyOn(
  RichEditorModule,
  'default'
);

/**
 * Retorna o spy do RichEditor, junto de mocks da instancia e de wrappers.
 */
export function doMockRichEditor() {
  // @ts-ignore
  richEditorSpy.mockImplementation(RichEditorMock);
  return {
    richEditorSpy,
    mockRichEditorInstante,
    mockEditorWrappers,
  };
}
