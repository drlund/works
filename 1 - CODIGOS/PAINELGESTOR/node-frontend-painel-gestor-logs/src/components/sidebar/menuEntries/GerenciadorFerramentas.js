import React from 'react';
import { Menu } from 'antd';
import {
  AudioOutlined,
  ToolOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';

const ferramenta = 'Gerenciador de Ferramentas';

export default function GerenciadorFerramentasEntries({
  authState,
  toggleSideBar,
  isFullScreenMode,
  sideBarCollapsed,
  warnKey,
  ...subMenuProps
}) {
  const acessoApp = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['ADMIN'],
    authState,
  });

  if (!acessoApp) {
    return null;
  }

  return (
    <Menu.Item {...subMenuProps} key="gerenciador-ferramentas">
      <Link to="/gerenciador-ferramentas/">
        <span>
          <ToolOutlined />
          <span>Gerenciador de Ferramentas</span>
        </span>
      </Link>
    </Menu.Item>
  );
}
