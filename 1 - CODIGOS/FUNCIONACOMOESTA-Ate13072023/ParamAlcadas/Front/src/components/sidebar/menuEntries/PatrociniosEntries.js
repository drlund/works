import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';

import { verifyPermission } from 'utils/Commons';
import SubMenu from 'antd/lib/menu/SubMenu';

const ferramenta = 'Patrocínios';

function PatrociniosEntries(props) {
  const permPatrocinios = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['USUARIO'],
    authState: props.authState,
  });

  if (!permPatrocinios) {
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
      key="patrocinios-gestao"
      title={
        <span>
          <FileDoneOutlined />
          <span>Patrocínio e Promoção</span>
        </span>
      }
    >
      <Menu.Item key="cadastrar-consultar-sac">
        <Link to="/patrocinios/cadastrar-consultar-sac">
          Cadastrar/Consultar SAC
        </Link>
      </Menu.Item>

      <Menu.Item key="painel">
        <a href="https://super.intranet.bb.com.br/superadm/home/noticia/3997">
          Painel Patro/Promo
        </a>
      </Menu.Item>

     
      <Menu.Item key="gestao-do-orcamento">
        <Link to="/patrocinios/gestao-do-orcamento">
     
          Gestão do Orçamento
        </Link>
      </Menu.Item>
    </SubMenu>
  );
}

export default PatrociniosEntries;
