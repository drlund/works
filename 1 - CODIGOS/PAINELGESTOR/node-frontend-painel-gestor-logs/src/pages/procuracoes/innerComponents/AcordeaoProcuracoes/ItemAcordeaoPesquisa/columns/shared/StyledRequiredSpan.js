import styled from 'styled-components';

export const StyledRequiredSpan = styled.span`
  font-weight: bold;
  font-size: 1.2em;

  display: inline-block;
  margin-bottom: 0.5em;

  &::before {
    content: '*';
    color: red;
    margin-right: 0.1em;
  }
`;
