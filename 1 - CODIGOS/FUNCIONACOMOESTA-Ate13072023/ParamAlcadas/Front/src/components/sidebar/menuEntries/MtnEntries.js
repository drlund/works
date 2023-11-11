import React from 'react';
import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';
import { Menu } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import usePermVotar from 'hooks/mtn/usePermVotar';
import { FERRAMENTAS_EM_MANUTENCAO } from 'config/app.config';

const ferramenta = 'MTN';
const isManutencao = FERRAMENTAS_EM_MANUTENCAO.includes(ferramenta);

function MtnEntries(props) {
  const permVotacao = usePermVotar();

  const permAnalisarMTN = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_ADM'],
    authState: props.authState,
  });

  const permPainelMtn = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_PAINEL'],
    authState: props.authState,
  });

  const permMTNReadOnly = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_READ_ONLY'],
    authState: props.authState,
  });

  const permMTNGerenciarPrazos = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_GERENCIAR_PRAZOS'],
    authState: props.authState,
  });

  const permAlterarMedida = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_ALTERAR_MEDIDA'],
    authState: props.authState,
  });

  const permAprovarMedida = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_APROVAR_MEDIDA'],
    authState: props.authState,
  });
  const permGerenciarMonitoramentos = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['MTN_GERENCIAR_MONITORAMENTOS'],
    authState: props.authState,
  });

  const permVersionarOcorrencia = verifyPermission({
    ferramenta,
    permissoesRequeridas: ["MTN_VERSIONAR_OCORRENCIA"],
    authState: props.authState,
  });

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="mtn"
      title={
        <span>
          <AlertOutlined />
          <span>MTN {isManutencao ? ' (Em manutenção)' : null}</span>
        </span>
      }
    >
      <Menu.Item key="mtn-minhas-ocorr">
        <Link to="/mtn/minhas-ocorrencias">Minhas Ocorrências</Link>
      </Menu.Item>
      {(permAnalisarMTN || permMTNReadOnly) && (
        <Menu.Item key="mtn-adm-ocorr">
          <Link to="/mtn/administrar-ocorrencias">Administrar Ocorrências</Link>
        </Menu.Item>
      )}
      {permAlterarMedida && (
        <Menu.Item key="mtn-alterar-medida">
          <Link to="/mtn/alterar-medida">Alterar Medida</Link>
        </Menu.Item>
      )}
      {permMTNGerenciarPrazos && (
        <Menu.Item key="mtn-ger-prazos">
          <Link to="/mtn/gerenciar-prazos">Gerenciar Prazos</Link>
        </Menu.Item>
      )}
      {permPainelMtn && (
        <Menu.Item key="mtn-painel">
          <Link to="/mtn/painel-mtn">Painel MTN</Link>
        </Menu.Item>
      )}
      {permMTNReadOnly && (
        <Menu.Item key="mtn-painel-analises">
          <Link to="/mtn/painel-analises">Painel Análises</Link>
        </Menu.Item>
      )}
      {permAprovarMedida && (
        <Menu.Item key="mtn-aprovar-medida">
          <Link to="/mtn/aprovar-medida">Aprovar Medida</Link>
        </Menu.Item>
      )}
      {permGerenciarMonitoramentos && (
        <Menu.Item key="mtn-gerenciar-monitoramentos">
          <Link to="/mtn/gerenciar-monitoramentos">
            Gerenciar Monitoramentos
          </Link>
        </Menu.Item>
      )}
      {permVotacao === true && (
        <Menu.Item key="mtn-votacoes">
          <Link to="/mtn/votacoes">Votações</Link>
        </Menu.Item>
      )}
      {permGerenciarMonitoramentos && (
        <Menu.Item key="mtn-monitoramento-gerenciar-comite-expandido">
          <Link to="/mtn/monitoramento/gerenciar-comite-expandido">
            Gerenciar Comitê Expandido
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  );
}

export default MtnEntries;
