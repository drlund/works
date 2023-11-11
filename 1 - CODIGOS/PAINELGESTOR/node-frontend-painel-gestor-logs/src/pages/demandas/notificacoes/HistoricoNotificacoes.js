import React, {Component} from 'react';
import _ from 'lodash';
import { getProfileURL } from 'utils/Commons';
import {List, Avatar, Skeleton, Divider} from 'antd';
import moment from  'moment';

class HistoricoNotificacoes extends Component {

  render= () => {
    
    return (
      <Skeleton active loading={false}>
        <Divider orientation="left">Histórico de Notificações</Divider>
        <div style={{ height: "450px", overflowY: "auto" }}>
          <List          
            bordered
            dataSource={this.props.historicoNotificacoes}
            renderItem={item => { 
              return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={getProfileURL(item.dadosResponsavel.matricula)} />}
                  title={_.capitalize(item.tipoEnvio) + " - " + moment(item.dataRegistro).format("DD/MM/YYYY HH:mm") }
                  description= {item.dadosResponsavel.matricula + " - " + item.dadosResponsavel.nome} 
                >                                
                </List.Item.Meta>
              </List.Item>
            )}}
          />
        </div>
      </Skeleton>
    );

  }
}

export default HistoricoNotificacoes;