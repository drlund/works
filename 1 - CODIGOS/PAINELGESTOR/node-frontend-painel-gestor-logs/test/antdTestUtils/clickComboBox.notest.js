import { fireEvent } from '@testing-library/react';

/**
 * Clica no primeiro componente com a classe `ant-select-selector`, normalmente usada nos `select` do `antd`.
 */
export async function clickComboBox() {
  // antd select dessa versão só reconhece o mousedown event
  return fireEvent.mouseDown(document.querySelector('.ant-select-selector'));
}
