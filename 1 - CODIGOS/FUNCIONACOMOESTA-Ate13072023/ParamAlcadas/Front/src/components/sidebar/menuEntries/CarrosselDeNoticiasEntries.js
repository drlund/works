import React from 'react';
import { Link } from 'react-router-dom';
// import { verifyPermission } from 'utils/Commons';
import { Menu } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

// const ferramenta = 'Carrossel de Notícias';

function CarrosselDeNoticiasEntries(props) {
  // const permissaoComunicacao = verifyPermission({
  //   ferramenta,
  //   permissoesRequeridas: ['USUARIO', 'ADM'],
  //   authState: props.authState,
  // });

  // if (!permissaoComunicacao) {
  //   return null;
  // }

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
  // <Menu.Item key="carrossel" {...subMenuProps}>
  //   <Link to="/carrossel/">
  //     <span>
  //       <PlayCircleOutlined />
  //       <span>Carrossel de Notícias</span>
  //     </span>
  //   </Link>
  // </Menu.Item>

    <Menu.SubMenu
      {...subMenuProps}
      key="carrossel"
      title={(
        <span>
          <PlayCircleOutlined />
          <span>Carrossel de Notícias</span>
        </span>
      )}
    >
      {/* {permissaoComunicacao && ( */}
      <Menu.Item key="gestao-carrossel">
        <Link to="/carrossel/">Gestão</Link>
      </Menu.Item>
      {/* )} */}
      {/* <Menu.Item key="player-carrossel">
        <Link to="">Player Vídeos</Link>
      </Menu.Item> */}
    </Menu.SubMenu>
  );
}

export default CarrosselDeNoticiasEntries;
