import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { verifyPermission } from "utils/Commons";

const ferramenta = "Horas Extras";

function HorasExtrasEntries(props) {

  const [podeAcessar, setPodeAcessar] = useState(false);

  useEffect(() => {

    const verificaAcessoTeste = () => {
      setPodeAcessar(ant => verifyPermission({
        ferramenta,
        permissoesRequeridas: ["ACESSO_TESTE"],
        authState: props.authState,
      }));
    }

    verificaAcessoTeste();

    return () => null;
  });

  const subMenuProps = {...props};
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;
  delete subMenuProps.authState;

  return (
    podeAcessar &&
    <Menu.SubMenu
    {...subMenuProps}
      key="hrXtra"
      title={
        <span>
          <ClockCircleOutlined />
          <span>Horas Extras</span>
        </span>
      }
    >
      <Menu.Item key="acompanhamento">
        <Link to="/hrxtra/acompanhamento">
          Acompanhamento
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default React.memo(HorasExtrasEntries);
