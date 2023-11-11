import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  message,
  Divider,
  Skeleton,
  Tabs,
  Result,
  Alert,
} from "antd";
import BBSpining from "components/BBSpinning/BBSpinning";
import DadosMonitoramento from "./GerenciarMonitoramentos/DadosMonitoramento";
import { fetchMonitoramentoParaVotacao } from "../../services/ducks/MtnComite.ducks";
import { useParams } from "react-router-dom";
import styles from "./VotarVersao.module.scss";
import ComiteVotacao from "./VotarVersao/ComiteVotacao";
import FormVotar from "./VotarVersao/FormVotar";
import useUsuarioLogado from "hooks/useUsuarioLogado";
import DadosVotoUsuario from "./VotarVersao/DadosVotoUsuario";
import VersaoEmVotacao from "./VotarVersao/VersaoEmVotacao";
import LinhaTempoMonitoramento from "./Monitoramento/LinhaTempoMonitoramento";
import usePermVotar from "hooks/mtn/usePermVotar";
import constants from "utils/Constants";

const { MTN_COMITE } = constants;
const { STATUS_PARAMETROS, TIPO_VOTO_PARAMETRO } = MTN_COMITE;

const getVotacaoUsuario = (comite, matriculaUsuario) => {
  if (comite && Array.isArray(comite) && matriculaUsuario) {
    const votacaoUsuario = comite.find((membroComite) => {
      return membroComite.matricula === matriculaUsuario;
    });

    return votacaoUsuario;
  }

  return null;
};

const VotarVersao = (props) => {
  const { idMonitoramento } = useParams();
  const permVotar = usePermVotar();
  const usuarioLogado = useUsuarioLogado();
  const [dadosMonitoramento, setDadosMonitoramento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [votacaoUsuario, setVotacaoUsuario] = useState(null);

  useEffect(() => {
    if (dadosMonitoramento !== null) {
      const votacaoUsuario = getVotacaoUsuario(
        dadosMonitoramento.versaoAtual.comite,
        usuarioLogado.chave
      );
      setVotacaoUsuario(votacaoUsuario);
    }
  }, [dadosMonitoramento, usuarioLogado.chave]);

  const onFetchDadosMonitoramento = useCallback(() => {
    setLoading(true);
    fetchMonitoramentoParaVotacao(idMonitoramento)
      .then((fetchedDadosMonitoramento) => {
        message.success("Dados atualizados com sucesso");
        setDadosMonitoramento(fetchedDadosMonitoramento);
      })
      .catch((error) => {
        message.error("Erro ao recuperar dados");
      })
      .then(() => {
        setLoading(false);
      });
  }, [idMonitoramento]);

  useEffect(() => {
    onFetchDadosMonitoramento();
  }, [onFetchDadosMonitoramento]);

  if (dadosMonitoramento === null || permVotar === null) {
    return (
      <BBSpining spinning={loading}>
        <Skeleton />
      </BBSpining>
    );
  }

  if (permVotar === false) {
    return (
      <Result
        status={403}
        title="Usuário sem acesso."
        subTitle="Somente funcionários membros do comitê de administração da Super Adm tem acesso à essa página."
      />
    );
  }

  const usuarioJaVotou =
    votacaoUsuario !== null &&
    votacaoUsuario.votadoEm !== null &&
    votacaoUsuario.tipoVoto.id !== TIPO_VOTO_PARAMETRO.ENCERRADO;

  const isVotacaoEmAndamento =
    dadosMonitoramento.versaoAtual.statusVersaoId ===
      STATUS_PARAMETROS.PENDENTE_VOTACAO ||
    dadosMonitoramento.versaoAtual.statusVersaoId ===
      STATUS_PARAMETROS.EM_VOTACAO;

  const isAlteracaoPendente =
    dadosMonitoramento.versaoAtual.statusVersaoId ===
    STATUS_PARAMETROS.ALTERACAO_PENDENTE;

  const deveExibirFormularioVotacao =
    !usuarioJaVotou && isVotacaoEmAndamento && !isAlteracaoPendente;

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[0, 20]} style={{ paddingBottom: 20 }}>
        <Col span={22} offset={1}>
          <Divider orientation="left">Dados Monitoramento</Divider>
        </Col>
        <Col span={22} offset={1}>
          <div className={styles.comiteWrapper}>
            {loading ? (
              <Skeleton />
            ) : (
              <Tabs type="card">
                <Tabs.TabPane tab="Dados Básicos" key="dadosBasicos">
                  <DadosMonitoramento dadosMonitoramento={dadosMonitoramento} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linha do Tempo" key="linhaTempo">
                  <LinhaTempoMonitoramento
                    linhaTempo={
                      dadosMonitoramento.linhaTempo
                        ? dadosMonitoramento.linhaTempo
                        : []
                    }
                  />
                </Tabs.TabPane>
              </Tabs>
            )}
          </div>
        </Col>
        <Col span={11} offset={1}>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            Votos
          </Divider>
          <div className={styles.comiteWrapper}>
            <ComiteVotacao comite={dadosMonitoramento.versaoAtual.comite} />
          </div>
        </Col>
        <Col span={9} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left">Versão em Votação</Divider>
            </Col>
            <Col span={24}>
              <VersaoEmVotacao
                versaoEmVotacao={dadosMonitoramento.versaoAtual}
              />
            </Col>
          </Row>
        </Col>

        <Col span={22} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left" style={{ marginBottom: 30 }}>
                Seu Voto
              </Divider>
            </Col>
            {isAlteracaoPendente && (
              <Col span={24}>
                <Alert
                  message="A versão proposta inicialmente foi alterada. Favor aguardar a análise das alterações para prosseguir com a votação."
                  type="error"
                  showIcon
                />
              </Col>
            )}

            {deveExibirFormularioVotacao && (
              <Col span={24}>
                <FormVotar
                  onFetchDadosMonitoramento={onFetchDadosMonitoramento}
                  idMonitoramento={idMonitoramento}
                  setLoading={setLoading}
                  loading={loading}
                />
              </Col>
            )}

            {usuarioJaVotou && (
              <Col span={24}>
                <DadosVotoUsuario
                  setLoading={setLoading}
                  loading={loading}
                  votacaoUsuario={votacaoUsuario}
                />
              </Col>
            )}

            {!usuarioJaVotou && !isVotacaoEmAndamento && !isAlteracaoPendente && (
              <Col span={24}>
                <Alert
                  message="Esta votação foi encerrada sem seu voto"
                  type="warning"
                  showIcon
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default VotarVersao;
