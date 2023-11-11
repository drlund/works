import React from 'react';
import Logo from './private.svg';
import './styles.css';

export default function AccessDenied(props) {
  const nomeFerramenta = props.nomeFerramenta ? <h4 className="tool-name">[ {props.nomeFerramenta} ]</h4> : '';
  const showMessage = (props.showMessage === false) ? false : true;

  return (
    <div style={{display: 'flex', alignContent: 'center', alignItems: 'center', flexGrow: 'inherit'}}>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <h1 className="info-message">Acesso não permitido a este conteúdo.</h1>
        
        {nomeFerramenta}

        { props.extraText &&
          <p style={{paddingTop: 20, paddingBottom: 20}}>
            <span className="normal-message-bold">
              {props.extraText}
            </span>
          </p>
        }

        { showMessage &&
          <span className="normal-message">
            Caso necessite acesso a esta página, solicite-o via <a href="https://falecom.intranet.bb.com.br" target="_blank" rel="noopener noreferrer">Falecom</a>
            &nbsp;no tópico Site Super - Acesso - Info (Planejamento a Apoio) da SuperAdm.
          </span>
        }

      </div>
      <div style={{ flex: 1, textAlign: 'center'}}>
        <img src={Logo} alt="logo acesso negado" style={{flex: 1, width: '40%'}} />
      </div>
    </div>
  )
}