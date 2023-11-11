import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Drawer,
  Row,
  Tabs,
  Typography
} from 'antd';
import _ from 'lodash';

import Pendencias from 'pages/designacao/Pendencias/Pendencias';
import Solicitacao from 'pages/designacao/Solicitacao';
import Constants from 'pages/designacao/Commons/Constants';
import Registro from 'pages/designacao/Registro';
import Consultas from 'pages/designacao/Consultas';

const { TabPane } = Tabs;
const { Title } = Typography;
const {
  TABS,
  ABA_ACORDO,
  ABA_PENDENCIAS_OUTROS,
  ABA_PENDENCIAS_PREFIXO,
  ABA_MINHAS_PENDENCIAS,
  ABA_REGISTRO,
  ABA_CONSULTAS,
} = Constants();

function AbasPendencias({
  tipoAcesso,
}) {
  const [tabs, setTabs] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setTabs(TABS.filter((elem) => (
        elem.acesso.some((inElem) => tipoAcesso.includes(inElem)))));
    }

    return () => {
      isMounted = false;
    };
  }, [setTabs, tipoAcesso, TABS]);

  const [defaultKey, setDefaultKey] = useState();

  useEffect(() => {
    let isMounted = true;

    if (tabs && tabs.length) {
      const [defKey] = tabs;

      if (isMounted) setDefaultKey(defKey.key);
    }

    return () => {
      isMounted = false;
    };
  }, [tabs]);

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const Extra = <Button type="primary" onClick={openDrawer}>Nova Solicitação de Movimentação</Button>;

  return (
    !_.isEmpty(tabs) && (
      <>
        <Tabs defaultActiveKey={defaultKey} type="card" tabBarExtraContent={!tipoAcesso.includes('ACESSO_TEMPORARIO') && Extra}>
          {
            tabs.map((elem) => (
              <TabPane tab={elem.nome} key={elem.key}>
                {
                  [
                    ABA_ACORDO,
                    ABA_PENDENCIAS_OUTROS,
                    ABA_PENDENCIAS_PREFIXO,
                    ABA_MINHAS_PENDENCIAS].includes(elem.key)
                  && <Pendencias key={elem.key} tab={elem} acessoFunci={tipoAcesso} />
                }
                {
                  [ABA_REGISTRO].includes(elem.key)
                  && <Registro key={elem.key} />
                }
                {
                  [ABA_CONSULTAS].includes(elem.key)
                  && <Consultas key={elem.key} />
                }
              </TabPane>
            ))
          }
        </Tabs>
        <Drawer
          key="drawer"
          title={<Row><Col span={24} style={{ textAlign: 'center' }}><Title level={3}>Solicitação de Movimentação Transitória</Title></Col></Row>}
          placement="right"
          visible={drawerVisible}
          width="85%"
          destroyOnClose
          closable={false}
          maskClosable={false}
          onClose={closeDrawer}
          keyboard={false}
          footer={[
            <Row key={1}><Col span={24} style={{ textAlign: 'center' }}><Button key="close" onClick={closeDrawer}>Fechar</Button></Col></Row>
          ]}
        >
          <Solicitacao />
        </Drawer>
      </>
    )
  );
}

export default React.memo(AbasPendencias);
