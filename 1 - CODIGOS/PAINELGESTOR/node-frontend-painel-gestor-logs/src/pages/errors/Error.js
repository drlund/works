import React from 'react';
import Cancel from './cancel.svg';
import './styles.css';

export default function Error(props) {
  const nomeFerramenta = props.nomeFerramenta ? <h4 className="tool-name">[ {props.nomeFerramenta} ]</h4> : '';
  const mensagemErro = (props.mensagemErro) ? props.mensagemErro : 'Erro!';

  return (
    <div style={{display: 'flex', alignContent: 'center', alignItems: 'center', flexGrow: 'inherit'}}>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <h1 className="info-message">Erro: {mensagemErro}</h1>
        
        {nomeFerramenta}

        { props.extraText &&
          <p style={{paddingTop: 20, paddingBottom: 20}}>
            <span className="normal-message-bold">
              {props.extraText}
            </span>
          </p>
        }

      </div>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <img src={Cancel} alt={mensagemErro} style={{flex: 1, width: '40%'}} />
      </div>
    </div>
  )
}