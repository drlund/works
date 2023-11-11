import React from 'react';
import { connect } from 'react-redux';

import 'moment/locale/pt-br';
import moment from 'moment';
import { message } from 'antd';

import Watermark from 'react-watermark-component';

const FunciWatermark = (props) => {

  if (!props.authState.isLoggedIn) {
    message.error("Funcionário não está logado");
    return null;
  }

  const matricula = props.authState.sessionData['chave'];
  const hoje = moment().format('DD/MM/YY HH:mm');

  const text = `${matricula} ${hoje}`;
  const beginAlarm = function() { console.log(`Funcionário ${matricula} tentou desativar a marca d'água deste componente em ${moment().format('DD/MM/YY HH:mm')}`); };

  const options = {
    chunkWidth: 200,
    chunkHeight: 50,
    textAlign: 'center',
    textBaseline: 'top',
    globalAlpha: props.globalAlpha || 0.40,
    font: '14px Arial',
    rotateAngle: -0.3,
    fillStyle: '#666'
  }

  return (
    <Watermark
      waterMarkText={text}
      openSecurityDefense
      securityAlarm={beginAlarm}
      options={options}
    >
      <div>
        {props.children}
      </div>
    </Watermark>

  )
}

const mapStateToProps = state => {
  return {
    authState: state.app.authState
  }
};

export default connect(mapStateToProps)(FunciWatermark);