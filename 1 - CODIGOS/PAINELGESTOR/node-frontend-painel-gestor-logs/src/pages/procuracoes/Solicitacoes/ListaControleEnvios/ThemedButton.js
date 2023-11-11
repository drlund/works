import { Button } from 'antd';
import styled from 'styled-components';

export const ThemedButton =
  /**
   * @type {TypedStyled<Button, { maincolor?: React.CSSProperties['color'], textcolor?: React.CSSProperties['color'] }>}
   */ (styled(Button))`
  &&&& {
    color: ${props => props.textcolor === undefined ? null : props.textcolor ?? props.maincolor};
    background-color: ${props => props.ghost ? 'transparent' : props.maincolor};
    border-color: ${props => props.maincolor};
    &:hover {
      color: ${props => props.textcolor === undefined ? null : props.textcolor ?? props.maincolor};
      background-color: ${props => props.ghost ? 'transparent' : props.maincolor};
      border-color: ${props => props.maincolor};
      filter: brightness(1.2);
    }
    &:focus {
      color: ${props => props.textcolor === undefined ? null : props.textcolor ?? props.maincolor};
      background-color: ${props => props.ghost ? 'transparent' : props.maincolor};
      border-color: ${props => props.maincolor};
      filter: brightness(1.2);
    }
  }
`;
