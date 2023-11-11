import { fireEvent } from '@testing-library/react';

export async function clickComboBox() {
  // antd select dessa versão só reconhece o mousedown event
  return fireEvent.mouseDown(document.querySelector('.ant-select-selector'));
}
