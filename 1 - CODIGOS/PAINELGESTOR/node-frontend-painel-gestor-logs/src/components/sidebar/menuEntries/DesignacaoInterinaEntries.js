import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { verifyPermission } from 'utils/Commons';

const ferramenta = 'Designação Interina';

function DesignacaoInterinaEntries(props) {
  /**
   * Início de código para ACESSO_TESTE. Retirar no app final
   */
  const [acessoTeste, setAcessoTeste] = useState(false);

  useEffect(() => {
    const { authState } = props;
    const verificaAcessoTeste = () => {
      setAcessoTeste(verifyPermission({
        ferramenta,
        permissoesRequeridas: ['ACESSO_TESTE'],
        authState,
      }));
    };

    verificaAcessoTeste();
  });

  /**
   * Fim área a remover no app final.
   */

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  if (acessoTeste) {
    return (
      <Menu.Item
        {...subMenuProps}
        title="Designação Interina"
        key="desigInt"
      >
        <Link to="/designacao/">
          <UserAddOutlined />
          <span>Designação Interina</span>
        </Link>
      </Menu.Item>
    );
  }

  return null;
}

export default React.memo(DesignacaoInterinaEntries);
