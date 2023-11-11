// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { SlidersOutlined } from '@ant-design/icons';

const ferramenta = 'Movimentações';

function MovimentacoesEntries(props) {
  const permissaoUsuario = verifyPermission({
    ferramenta,
    permissoesRequeridas: [
      'ADM_QUORUM_PROPRIO',
      'ADM_QUORUM_QUALQUER',
      'PARAM_ALCADAS_ADMIN',
      'PARAM_ALCADAS_USUARIO',
      'PARAM_SUSPENSOES_USUARIO',
    ],
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
    <SubMenu
      {...subMenuProps}
      key="movimentacoes"
      title={
        <span>
          <SlidersOutlined />
          <span>Movimentações</span>
        </span>
      }
    >
      <Menu.Item key="gerenciar-quorum">
        <Link to="/movimentacoes/gerenciar-quorum">
          Gerenciar Quórum
        </Link>
      </Menu.Item>

      <Menu.Item key="gerenciar-jurisdicao">
        <Link to="/movimentacoes/gerenciar-jurisdicao">
          Gerenciar Jurisdição
        </Link>
      </Menu.Item>

      <Menu.Item key="parametrizacao-das-alcadas">
        <Link to="/movimentacoes/parametrizacao-das-alcadas">
          Parametrização das Alçadas
        </Link>
      </Menu.Item>

      <Menu.Item key="parametrizacao-das-suspensoes">
        <Link to="/movimentacoes/parametrizacao-das-suspensoes">
          Parametrização das Suspensões
        </Link>
      </Menu.Item>
    </SubMenu>
  );
}

export default MovimentacoesEntries;
