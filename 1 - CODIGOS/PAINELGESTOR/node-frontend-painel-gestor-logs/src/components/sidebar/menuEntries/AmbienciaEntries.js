import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';
import { Menu } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

const ferramenta = 'Ambiência';

function AmbienciaEntries(props) {
  const permissaoUsuario = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['AVALIADOR_GERAL', 'ADM'],
    authState: props.authState,
  });

  if (!permissaoUsuario) {
    return null;
  }

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.Item key="ambiencia"
      {...subMenuProps}
      title="Avaliação de Ambientes"
    >
      <Link to="/ambiencia">
        <span>
          <ShopOutlined />
          <span>Ambiência</span>
        </span>
      </Link>
    </Menu.Item>
  );
}

export default AmbienciaEntries;
