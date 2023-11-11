import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';

import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import {
  DashboardOutlined,
  ControlOutlined,
  SyncOutlined,
  KeyOutlined,
} from '@ant-design/icons';

const ferramenta = 'Painel do Gestor';

export default function PainelGestorEntries({
  authState,
  toggleSideBar,
  isFullScreenMode,
  sideBarCollapsed,
  warnKey,
  ...subMenuProps
}) {
  const permissaoUsuario = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['ADM', 'ADM_LOGS'],
    authState,
  });

  if (!permissaoUsuario) {
    return null;
  }

  return (
    <SubMenu
      key="painel"
      {...subMenuProps}
      title={
        <span>
          <DashboardOutlined />
          <span>Painel Gestor 2.0</span>
        </span>
      }
    >
      <Menu.Item key="painel">
        <Link to="/painel-gestor">
          <span>
            <ControlOutlined />
            <span>Painel Gestão Adm</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="acessos">
        <Link to="/painel-gestor/log-acessos">
          <span>
            <KeyOutlined />
            <span>Log Acessos</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="atualizacoes">
        <Link to="/painel-gestor/log-atualizacoes">
          <span>
            <SyncOutlined />
            <span>Log Atualizações</span>
          </span>
        </Link>
      </Menu.Item>
    </SubMenu>
  );
}
