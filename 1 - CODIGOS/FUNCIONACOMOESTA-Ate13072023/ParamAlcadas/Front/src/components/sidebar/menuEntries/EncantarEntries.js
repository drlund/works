import React from "react";
import { Link } from "react-router-dom";
import { verifyPermission } from "utils/Commons";
import { Menu } from "antd";
// import usePermRegistroReacao from "hooks/encantar/usePermRegistroReacao";
// import usePermIncluirSolicitacao from "hooks/encantar/usePermIncluirSolicitacao";
// import { podeIncluirSolicitacao } from "services/ducks/Encantar.ducks";

import {
  HeartOutlined,
  SendOutlined,
  TagsOutlined,
  GiftOutlined,
  SmileOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";

const ferramenta = "Encantar";

function EncantarEntries(props) {

  // const permRegistroReacao = usePermRegistroReacao();
  // const permIncluirSolicitacao = usePermIncluirSolicitacao();
  const permRegistroReacao = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["REACAO"],
    authState: props.authState,
  });

  const permIncluirSolicitacao = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["INCLUSAO"],
    authState: props.authState,
  });

  const permPiloto = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["PILOTO"],
    authState: props.authState,
  });

  const permGerenciarCatalogo = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["GERENCIAR_CATALOGO"],
    authState: props.authState,
  });

  const permDetentoresEstoque = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["GERENCIAR_DETENTORES_ESTOQUE"],
    authState: props.authState,
  });

  const permAcompanharSolicitacoes = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["ACOMPANHAR_SOLICITACOES"],
    authState: props.authState,
  });

  if (!permPiloto) {
    //só visualiza o menu do encantar quem estiver com a permissao de piloto
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
      key="encantar"
      title={
        <span>
          <HeartOutlined />
          <span>Encantar</span>
        </span>
      }
    >
      {permGerenciarCatalogo && (
        <Menu.Item key="encantar-catalogo">
          <Link to="/encantar/catalogo">
            <span>
              <ReconciliationOutlined />
              <span>Catálogo</span>
            </span>
          </Link>
        </Menu.Item>
      )}

      {/* Consulta o estoque apenas quem tem a matricula inclusa na tabela brindesResponsavelEntrega */}
      <Menu.SubMenu
        key="encantar-estoque"
        title={
          <span>
            <TagsOutlined />
            <span>Estoque</span>
          </span>
        }
      >
        <Menu.Item key="encantar-est-consultar">
          <Link to="/encantar/estoque/consultar">Consultar</Link>
        </Menu.Item>
        {permDetentoresEstoque && (
          <Menu.Item key="encantar-est-detentores">
            <Link to="/encantar/estoque/detentores">Detentores Estoque</Link>
          </Menu.Item>
        )}
        {/*         <Menu.Item key="encantar-est-responsaveis">
          <Link to="/encantar/estoque/responsaveis">Responsáveis Estoque</Link>
        </Menu.Item>
 */}{" "}
      </Menu.SubMenu>

      {(permPiloto || permIncluirSolicitacao) && (
        <Menu.SubMenu
          key="encantar-solicitacoes"
          title={
            <span>
              <GiftOutlined />
              <span>Solicitações</span>
            </span>
          }
        >
          <Menu.Item key="encantar-sol-incluir">
            <Link to="/encantar/solicitacoes/incluir">Nova Solicitação</Link>
          </Menu.Item>
          <Menu.Item key="encantar-sol-consultar">
            <Link to="/encantar/solicitacoes/consultar">Consultar</Link>
          </Menu.Item>
          <Menu.Item key="encantar-sol-aprovacoes">
            <Link to="/encantar/solicitacoes/aprovacoes">Aprovação</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}

      <Menu.SubMenu
        key="encantar-enviar-receber"
        title={
          <span>
            <SendOutlined />
            <span>{`Enviar ↔ Receber`}</span>
          </span>
        }
      >
        {permAcompanharSolicitacoes && (
          <Menu.Item key="encantar-envios">
            <Link to="/encantar/envios">Envio / Entrega</Link>
          </Menu.Item>
        )}
        {permAcompanharSolicitacoes && (
          <Menu.Item key="encantar-env-pendente-recebimento">
            <Link to="/encantar/recebimentos-prefixo">
              Recebimentos Prefixo
            </Link>
          </Menu.Item>
        )}

        <Menu.Item key="encantar-end-responsaveis">
          <Link to="/encantar/enviar-receber/responsaveis-envio">
            Responsáveis Envio
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      {permRegistroReacao && (
        <Menu.Item key="encantar-reacoes">
          <Link to="/encantar/reacoes-clientes">
            <span>
              <SmileOutlined />
              <span>Reações Clientes</span>
            </span>
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  );
}

export default EncantarEntries;
