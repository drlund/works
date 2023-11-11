import styled from 'styled-components';

const defaultReadonlyStyle = { paddingLeft: '42px'};

const ReadOnlyHeader = styled.h4`
  font-weight: bold
`;

const ReadOnlyContent = styled.span`
  font-size: 1rem
`;

export {
  defaultReadonlyStyle,
  ReadOnlyHeader,
  ReadOnlyContent
}
