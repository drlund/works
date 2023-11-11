/* eslint-disable testing-library/no-node-access */
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Helper de testes para date pickers do antd.
 *
 * @param {() => HTMLElement} getElement função que ao ser chamada retorna um elemento html
 * @param {string} value valor a ser passado ao datepicker no formato que ele espera
 */
export async function selectInDatePicker(getElement, value) {
  const datePicker = getElement();
  await fireEvent.mouseDown(datePicker);
  await fireEvent.change(datePicker, { target: { value } });
  await userEvent.click(document.querySelectorAll('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-cell-selected')[0], { pointerEventsCheck: false });
}
