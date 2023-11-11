/* eslint-disable testing-library/no-node-access */
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function selectInDatePicker(getElement, value) {
  const datePicker = getElement();
  await fireEvent.mouseDown(datePicker);
  await fireEvent.change(datePicker, { target: { value } });
  await userEvent.click(document.querySelectorAll('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden) .ant-picker-cell-selected')[0], { pointerEventsCheck: false });
}
