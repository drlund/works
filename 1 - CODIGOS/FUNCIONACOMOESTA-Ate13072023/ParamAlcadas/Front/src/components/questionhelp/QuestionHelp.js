import React from 'react';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types'
/**
 * Componente QuestionHelp - exibe um icone de interrogacao com um texto de ajuda.
 * 
 * @param {*} props :
 *  placement: posicao onde o tooltip sera exibido (ver Tooltip do ant-design)
 *  title: texto a ser apresentado pelo tooltip ao passar o mouse sobre o icone 
 *         de interrogacao.
 */
const QuestionHelp = (props) => {
  const baseStyle = {verticalAlign: 'middle', cursor: 'pointer'};
  const iconStyle = props.style ? {...props.style, ...baseStyle} : {...baseStyle};
  const contentWidth = props.contentWidth ? props.contentWidth : 250

  return (
    <Tooltip placement={props.placement || "top"} title={props.title || ""} overlayStyle={{maxWidth: contentWidth}}>
      <QuestionCircleTwoTone style={iconStyle} />
    </Tooltip>
  );
}

QuestionHelp.propTypes = {
  style: PropTypes.object, //estilo do icone 
  title: PropTypes.any.isRequired, //texto a ser exibido no tooltip
  placement: PropTypes.string, //posicionamento do tooltip
  contentWidth: PropTypes.number //largura da area do texto do tooltip
}

export default QuestionHelp;
