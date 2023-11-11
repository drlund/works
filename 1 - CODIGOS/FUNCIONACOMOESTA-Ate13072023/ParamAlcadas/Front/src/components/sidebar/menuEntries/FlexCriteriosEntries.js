import React from 'react';
import { Menu } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';

const ferramenta = 'Flex Critérios';

export default function FlexCriteriosEntries({
  authState,
  toggleSideBar,
  isFullScreenMode,
  sideBarCollapsed,
  warnKey,
  ...subMenuProps
}) {
  const acessoApp = verifyPermission({
    ferramenta,
    permissoesRequeridas: [
      'SOLICITANTE',
      'MANIFESTANTE',
      'ANALISTA',
      'DESPACHANTE',
      'DEFERIDOR',
      'EXECUTANTE',
      'ROOT',
    ],
    authState,
  });

  const acessoIncluirPedido = verifyPermission({
    ferramenta,
    permissoesRequeridas: [
      'SOLICITANTE',
      'MANIFESTANTE',
      'ANALISTA',
      'DESPACHANTE',
      'DEFERIDOR',
      'ROOT',
    ],
    authState,
  });

  if (!acessoApp) {
    return null;
  }

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="flex-criterios"
      title={
        <span>
          <UserSwitchOutlined />
          <span>Flexibilização de Critérios</span>
        </span>
      }
    >
      <Menu.Item key="consulta">
        <Link to="/flex-criterios">Acompanhar Pedidos</Link>
      </Menu.Item>
      {acessoIncluirPedido && (
        <Menu.Item key="incluir">
          <Link to="/flex-criterios/incluir">Incluir Pedido</Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  );
}
