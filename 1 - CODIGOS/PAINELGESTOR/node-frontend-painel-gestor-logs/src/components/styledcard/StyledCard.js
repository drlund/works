import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const CardBase = props => {
  let filteredProps = {...props};
  delete filteredProps.noShadow;
  delete filteredProps.titleBGColor;
  delete filteredProps.titleFontColor;
  delete filteredProps.titleFontWeight;

  return (
    <Card {...filteredProps}>
      {props.children}
    </Card>
  )
};

const calculateMargin = (props) => {
  if (props.titleBGColor) {
    if (props.noShadow) {
      return "-1px"
    } else {
      return "-2px"
    }  
  }

  return "!important"
}

/**
 * Wrapper para o componente Card do ant-design.
 */
const StyledCard = styled(CardBase)`
  
  margin:10px;
  margin-bottom: 20px;
  background-color: !important;
  box-shadow: ${props => props.noShadow ? "none" : "0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)"};
  & > .ant-card-head{
    background-color: ${props => props.titleBGColor ? props.titleBGColor : "!important"};
    color: ${props => props.titleFontColor ? props.titleFontColor : "!important"};
    margin-left: ${props => calculateMargin(props)};
    margin-right: ${props => calculateMargin(props)};
    & > .ant-card-head-title{
      font-weight: ${props => props.titleFontWeight ? props.titleFontWeight : "!important"};
    }
  }
`;

export default StyledCard;