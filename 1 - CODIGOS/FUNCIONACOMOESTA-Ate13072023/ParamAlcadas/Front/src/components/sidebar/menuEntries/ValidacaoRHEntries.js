import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import Acesso from 'components/Acesso/Acesso';

function ValidacaoRHEntries(props) {
  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Acesso
      ferramenta="Validação RH"
      listaAcessos={['Acesso']}
      naoExibir
      componente={(
        <Menu.Item
          {...subMenuProps}
          title="Validação RH"
          key="validRH"
        >
          <Link to="/validacaorh/">
            <UserAddOutlined />
            <span>Validação RH</span>
          </Link>
        </Menu.Item>
      )}
    />
  );
}

export default React.memo(ValidacaoRHEntries);
