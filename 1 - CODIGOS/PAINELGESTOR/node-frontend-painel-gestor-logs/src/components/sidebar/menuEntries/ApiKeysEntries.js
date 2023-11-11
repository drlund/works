import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';
import { Menu } from 'antd';
import { KeyOutlined } from '@ant-design/icons';

const ferramenta = 'Chaves de API';

function ApiKeysEntries(props) {
  const { authState } = props;

  const permAutSecex = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['GERENCIAR_CHAVES'],
    authState,
  });

  if (!permAutSecex) {
    return null;
  }

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="api-keys"
      title={(
        <span>
          <KeyOutlined />
          <span>Chaves de API</span>
        </span>
      )}
    >
      <Menu.Item key="apik-consultar-chaves">
        <Link to="/api-keys/consultar-chaves">
          Consultar Chaves
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  );
}

export default ApiKeysEntries;
