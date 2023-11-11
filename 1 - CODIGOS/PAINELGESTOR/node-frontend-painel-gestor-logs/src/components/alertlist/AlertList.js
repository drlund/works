import React from 'react';
import { Alert } from 'antd';

/**
 * Renderiza o componente Alert do ant design com o icone de erro e uma lista nao ordenada de erros.
 * @param props - informar as seguintes propriedades:
 *  - messagesList: com um array de strings com as mensagens de erro.
 *  - title: titulo do alert
 *  - type: tipo do estilo do alert, podendo ser: success, info, warning ou error (padrao).
 * 
 * Atencao: se a lista de mensagens estiver vazia, o componente nao sera renderizado.
 */
export default (props) => {
  if (!props.messagesList || !props.messagesList.length) {
    return null;
  }

  let countItem = 1;
  
  return (
    <Alert
      message={props.title || <br/>}
      closable={props.closable || false}
      description={        
        <ul style={{paddingInlineStart: 0}}>
          {props.messagesList.map(item => {
            return <li key={countItem++}>{item}</li>
          })}
        </ul>
      }
      type={props.type || "error"}
      showIcon
      style={props.style || {}}
    />
  )
}
