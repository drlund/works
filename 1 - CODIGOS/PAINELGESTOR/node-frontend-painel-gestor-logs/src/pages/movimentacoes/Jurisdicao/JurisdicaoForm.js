import React from 'react';

import { Card, Tabs } from 'antd';

import './JurisdicaoForm.css';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import GerenciarJurisdicao from './componentes/GerenciarJurisdicao';
import MinhaJurisdicao from './componentes/MinhaJurisdicao';

const { TabPane } = Tabs;

function JurisdicaoForm() {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  return (
    <Card>
      <Tabs type="card">
        {permissao.includes('ADM_JURISDICAO_PROPRIA') ||
        permissao.includes('ADM_JURISDICAO_QUALQUER') ? (
          <TabPane
            tab="Minha Jurisdição"
            key="minha-jurisdição"
            style={{ paddingTop: 30 }}
          >
            <MinhaJurisdicao />
          </TabPane>
        ) : null}
        {permissao.includes('ADM_JURISDICAO_QUALQUER') ? (
          <TabPane tab="Gerenciar Jurisdição" key="gerenciar-jurisdição">
            <GerenciarJurisdicao />
          </TabPane>
        ) : null}
      </Tabs>
    </Card>
  );
}

export default JurisdicaoForm;
