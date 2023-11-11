import { Form } from 'antd';
import styled, { css } from 'styled-components';

export const FormWithLabelNoWrap = /** @type {TypedStyled<Form, { lineheightvariant?: boolean }>} */ (styled(Form))`
  & .ant-form-item-label {
    white-space: normal;
    text-align: start;
  }
  ${({ lineheightvariant }) => lineheightvariant && css`
    & .ant-form-item-label {
      line-height: 1.2em;
    }
  `}
`;
