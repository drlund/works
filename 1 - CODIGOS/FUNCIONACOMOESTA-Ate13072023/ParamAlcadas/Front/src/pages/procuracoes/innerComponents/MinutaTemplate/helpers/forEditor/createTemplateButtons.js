import { createNormalizedKey } from '../others/createNormalizedKey';
import { minutaFieldHtml } from './minutaFieldHtml';

/**
 * @param {{
 *  fieldsMap: {
 *    [key: string]: string,
 *  },
 *  editor: any,
 *  buttons: {
 *    [key: string]: any,
 *  }
 * }} props
 */
export function createTemplateButtons({ fieldsMap, editor, buttons }) {
  editor.ui.registry.addButton('resetButtons', {
    text: 'Checar Campos',
    tooltip: 'Recalcula se possui todos os campos necessários',
    icon: 'checklist',
    disabled: true,
    onAction: () => {
      Object.values(buttons).forEach((b) => b.setDisabled(false));
    }
  });

  Object.entries(fieldsMap).forEach(([key, value]) => {
    const [normalizedKey, blocked] = createNormalizedKey(key);
    const displayName = String(value).toLocaleUpperCase();

    editor.ui.registry.addButton(key, {
      text: `&lt;${displayName}&gt;`,
      onSetup: ((b) => {
        buttons[normalizedKey] = b;
      }),
      onAction: () => editor.insertContent(minutaFieldHtml(normalizedKey, value, blocked))
    });
  });
}
