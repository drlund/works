import React, { useState } from 'react';
import uuid from 'uuid/v4';
import {
  Descriptions,
  Row,
  Col,
  Avatar,
  message,
  Typography,
  Divider,
  Skeleton,
} from 'antd';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import _ from 'lodash';

import {
  getProfileURL,
  getHumanGramURL,
  getHumanGramUorURL,
} from 'utils/Commons';
import useEffectOnce from 'utils/useEffectOnce';

import StyledCardPrimary from 'components/styledcard/StyledCard';
import { getSolicitacao } from 'services/ducks/Designacao.ducks';

import PageLoading from 'components/pageloading/PageLoading';

import './solicitacao.css';
import Constants from 'pages/designacao/Commons/Constants';

const { Item } = Descriptions;

const { Text } = Typography;

const NULL_PREFIXOS = ['0000', '', null, undefined];

const { DESIGNACAO } = Constants().TIPOS;

function Solicitacao(props) {
  const [solicitacao, setSolicitacao] = useState();
  const [fetchingData, setFetchingData] = useState(false);

  function obterSolicitacao() {
    const { id } = props;

    setFetchingData(true);

    getSolicitacao(id)
      .then((thisSolicitacao) => {
        setSolicitacao(thisSolicitacao);
      })
      .catch((error) => {
        message.error(error);
      })
      .then(() => {
        setFetchingData(false);
      });
  }

  useEffectOnce(() => {
    obterSolicitacao();
  });

  const renderDescription01 = () => {
    if (solicitacao) {
      return (
        <Item key={uuid()} label="Protocolo da Movimentação">
          <Row>
            <Col>{solicitacao.protocolo}</Col>
          </Row>
        </Item>
      );
    }

    return <Skeleton active />;
  };

  const renderDescription02 = () => {
    if (solicitacao) {
      return (
        <Item key={uuid()} label="Tipo de Movimentação">
          <Row>
            <Col>{solicitacao.tipoDemanda.nome}</Col>
          </Row>
        </Item>
      );
    }

    return <Skeleton active />;
  };

  const renderDescription1 = () => {
    if (solicitacao) {
      return (
        <>
          {solicitacao.tipo === DESIGNACAO && (
            <Item key={uuid()} label="Função de Origem">
              <Row className="grid-row-background-origem">
                <Col>
                  {solicitacao.funcao_orig}
                  {' '}
                  {_.isNil(solicitacao.matricula_orig)
                    ? 'Matrícula Fora da Base'
                    : solicitacao.funcaoOrigem.nome_comissao}
                </Col>
              </Row>
            </Item>
          )}
          <Item key={uuid()} label="Prefixo de Origem">
            <Row className="grid-row-background-origem">
              <Col>
                <a
                  href={getHumanGramUorURL(
                    solicitacao.prefixo_orig.uor_dependencia
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {solicitacao.pref_orig}
                  {' '}
                  {solicitacao.prefixo_orig.nome}
                </a>
              </Col>
            </Row>
          </Item>
          {solicitacao.paaOrig && (
            <Item key={uuid()} label="Agência Madrinha">
              <Row className="grid-row-background-origem">
                <Col>
                  <a
                    href={getHumanGramUorURL(solicitacao.madrinhaOrig.uor)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {solicitacao.madrinhaOrig.prefixo}
                    {' '}
                    {solicitacao.madrinhaOrig.nome}
                  </a>
                </Col>
              </Row>
            </Item>
          )}
          {!NULL_PREFIXOS.includes(solicitacao.prefixo_orig.cd_gerev_juris)
            && !_.isNil(solicitacao.prefixo_gerev_orig)
            && !_.isEmpty(solicitacao.prefixo_gerev_orig)
            && (
              <Item key={uuid()} label="Super Comercial/Regional de Origem">
                <Row className="grid-row-background-origem">
                  <Col>
                    <a
                      href={getHumanGramUorURL(
                        parseInt(solicitacao.prefixo_gerev_orig.uor, 10)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {solicitacao.prefixo_gerev_orig.prefixo}
                      {' '}
                      {solicitacao.prefixo_gerev_orig.nome}
                    </a>
                  </Col>
                </Row>
              </Item>
            )}
          {!NULL_PREFIXOS.includes(solicitacao.prefixo_orig.cd_super_juris)
            && !_.isNil(solicitacao.prefixo_super_orig)
            && !_.isEmpty(solicitacao.prefixo_super_orig) && (
              <Item key={uuid()} label="Super Estadual de Origem">
                <Row className="grid-row-background-origem">
                  <Col>
                    <a
                      href={getHumanGramUorURL(
                        parseInt(solicitacao.prefixo_super_orig.uor, 10)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {solicitacao.prefixo_super_orig.prefixo}
                      {' '}
                      {solicitacao.prefixo_super_orig.nome}
                    </a>
                  </Col>
                </Row>
              </Item>
          )}
          <Item key={uuid()} label="Funcionário Movimentado (Origem)">
            <Row className="grid-row-background-origem">
              <Col>
                <a
                  href={getHumanGramURL(solicitacao.matr_orig)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Row>
                    <Col span={2}>
                      <Avatar src={getProfileURL(solicitacao.matr_orig)} />
                    </Col>
                    <Col>
                      <Text code style={{ fontSize: '1.2rem' }}>
                        {solicitacao.matr_orig}
                      </Text>
                      <br />
                      <Text code>
                        {_.isNil(solicitacao.matricula_orig)
                          ? 'Matrícula Fora da Base'
                          : solicitacao.matricula_orig.nome}
                      </Text>
                    </Col>
                  </Row>
                </a>
              </Col>
            </Row>
          </Item>
          <Item key={uuid()} label="Período da Movimentação">
            <Row>
              <Col>
                {moment(solicitacao.dt_ini).format('DD/MM/YYYY')}
                {' '}
                a
                {' '}
                {moment(solicitacao.dt_fim).format('DD/MM/YYYY')}
              </Col>
            </Row>
            <Row>
              <Col>
                {solicitacao.dias_totais}
                {' '}
                dias,
                {' '}
                {solicitacao.dias_uteis}
                {' '}
                dias
                úteis
              </Col>
            </Row>
          </Item>
          <Item key={uuid()} label="Motivo da Movimentação">
            <Row>
              <Col>
                {solicitacao.tipo === DESIGNACAO
                  ? solicitacao.optBasica.texto
                  : 'Adição para Composição Temporária de Equipe'}
              </Col>
            </Row>
          </Item>
        </>
      );
    }

    return <Skeleton active />;
  };

  const renderDescription2 = () => {
    if (solicitacao) {
      return (
        <>
          <Item key={uuid()} label="Função de Destino">
            <Row className="grid-row-background-destino">
              <Col>
                {solicitacao.tipo === DESIGNACAO
                  ? solicitacao.funcao_dest
                  : solicitacao.funcao_orig}
                {' '}
                {solicitacao.tipo === DESIGNACAO
                  ? solicitacao.funcaoDestino && solicitacao.funcaoDestino.nome_comissao
                  : solicitacao.funcaoOrigem && solicitacao.funcaoOrigem.nome_comissao}
              </Col>
            </Row>
          </Item>
          <Item key={uuid()} label="Prefixo de Destino">
            <Row className="grid-row-background-destino">
              <Col>
                <a
                  href={getHumanGramUorURL(
                    solicitacao.prefixo_dest.uor_dependencia
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {solicitacao.pref_dest}
                  {' '}
                  {solicitacao.prefixo_dest.nome}
                </a>
              </Col>
            </Row>
          </Item>
          {solicitacao.paaDest && (
            <Item key={uuid()} label="Agência Madrinha">
              <Row className="grid-row-background-destino">
                <Col>
                  <a
                    href={getHumanGramUorURL(solicitacao.madrinhaDest.uor)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {solicitacao.madrinhaDest.prefixo}
                    {' '}
                    {solicitacao.madrinhaDest.nome}
                  </a>
                </Col>
              </Row>
            </Item>
          )}
          {!NULL_PREFIXOS.includes(solicitacao.prefixo_dest.cd_gerev_juris)
            && !_.isNil(solicitacao.prefixo_gerev_dest)
            && !_.isEmpty(solicitacao.prefixo_gerev_dest) && (
              <Item key={uuid()} label="Super Comercial/Regional de Destino">
                <Row className="grid-row-background-destino">
                  <Col>
                    <a
                      href={getHumanGramUorURL(
                        parseInt(solicitacao.prefixo_gerev_dest.uor, 10)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {solicitacao.prefixo_gerev_dest.prefixo}
                      {' '}
                      {solicitacao.prefixo_gerev_dest.nome}
                    </a>
                  </Col>
                </Row>
              </Item>
          )}
          {!NULL_PREFIXOS.includes(solicitacao.prefixo_dest.cd_super_juris)
            && !_.isNil(solicitacao.prefixo_super_dest)
            && !_.isEmpty(solicitacao.prefixo_super_dest) && (
              <Item key={uuid()} label="Super Estadual de Destino">
                <Row className="grid-row-background-destino">
                  <Col>
                    <a
                      href={getHumanGramUorURL(
                        parseInt(solicitacao.prefixo_super_dest.uor, 10)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {solicitacao.prefixo_super_dest.prefixo}
                      {' '}
                      {solicitacao.prefixo_super_dest.nome}
                    </a>
                  </Col>
                </Row>
              </Item>
          )}
          {solicitacao.tipo === DESIGNACAO && (
            <Item key={uuid()} label="Funcionário Ausente (Destino)">
              <Row className="grid-row-background-destino">
                <Col>
                  {solicitacao.matr_dest === 'F0000000' ? (
                    <Row>
                      <Col span={2}>
                        <Avatar icon={<UserOutlined />} />
                      </Col>
                      <Col>
                        <Text code>
                          {solicitacao.matr_dest}
                          <br />
                          VACÂNCIA
                        </Text>
                      </Col>
                    </Row>
                  ) : (
                    <a
                      href={getHumanGramURL(solicitacao.matr_dest)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Row>
                        <Col span={2}>
                          <Avatar src={getProfileURL(solicitacao.matr_dest)} />
                        </Col>
                        <Col>
                          <Text code style={{ fontSize: '1.2rem' }}>
                            {solicitacao.matr_dest}
                          </Text>
                          <br />
                          <Text code>
                            {_.isNil(solicitacao.matricula_dest)
                              ? 'Matrícula Fora da Base'
                              : solicitacao.matricula_dest.nome}
                          </Text>
                        </Col>
                      </Row>
                    </a>
                  )}
                </Col>
              </Row>
            </Item>
          )}
          {solicitacao.tipo === DESIGNACAO && (
            <Item key={uuid()} label="Motivos de Ausência Informados">
              <>
                {solicitacao.analise.ausencias.map((ausencia) => (
                  <div key={ausencia.id}>
                    <Row>
                      <Col>{ausencia.tipoAusencia}</Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        Início:
                        {' '}
                        {moment(ausencia.dataInicio).format('DD/MM/YYYY')}
                      </Col>
                      <Col span={12}>
                        Fim:
                        {' '}
                        {moment(ausencia.dataFim).format('DD/MM/YYYY')}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {ausencia.periodo}
                        {' '}
                        dias (
                        {ausencia.qtdeDiasUteis}
                        {' '}
                        dias
                        úteis)
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                ))}
              </>
            </Item>
          )}
          <Item key={uuid()} label="Funcionário Solicitante">
            <Row>
              <Col>
                <a
                  href={getHumanGramURL(solicitacao.matr_solicit)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Row>
                    <Col span={2}>
                      <Avatar src={getProfileURL(solicitacao.matr_solicit)} />
                    </Col>
                    <Col>
                      <Text code style={{ fontSize: '1.2rem' }}>
                        {solicitacao.matr_solicit}
                      </Text>
                      <br />
                      <Text code>
                        {_.isNil(solicitacao.matricula_solicit)
                          ? 'Matrícula Fora da Base'
                          : solicitacao.matricula_solicit.nome}
                      </Text>
                    </Col>
                  </Row>
                </a>
              </Col>
            </Row>
          </Item>
        </>
      );
    }

    return <Skeleton active />;
  };

  const renderDescription3 = () => {
    if (solicitacao) {
      return (
        <>
          <Item
            key={uuid()}
            label="Funcionário Responsável pela Condução (se houver)"
          >
            <Row>
              <Col>
                <a
                  href={getHumanGramURL(solicitacao.responsavel)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Row>
                    {solicitacao.responsavel ? (
                      <>
                        <Col span={2}>
                          <Avatar
                            src={getProfileURL(solicitacao.responsavel)}
                          />
                        </Col>
                        <Col>
                          <Text code style={{ fontSize: '1.2rem' }}>
                            {solicitacao.responsavel}
                          </Text>
                          <br />
                          <Text code>
                            {_.isNil(solicitacao.matricula_resp)
                              ? 'Matrícula Fora da Base'
                              : solicitacao.matricula_resp.nome}
                          </Text>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col span={2} />
                        <Col span={2} />
                      </>
                    )}
                  </Row>
                </a>
              </Col>
            </Row>
          </Item>
          <Item key={uuid()} label="Situação Atual">
            <Row>
              <Col>{solicitacao.situacao.descricao}</Col>
            </Row>
          </Item>
          <Item key={uuid()} label="Status Atual">
            <Row>
              <Col>{solicitacao.status.descricao}</Col>
            </Row>
          </Item>
          <Item key={uuid()} label="E-mails enviados">
            {solicitacao.mailLog.map((mail) => (
              <Row key={mail.id}>
                <Col>
                  Motivo:
                  {' '}
                  {mail.tipoEmail}
                  {' '}
                  <br />
                  {' '}
                  Enviado em
                  {' '}
                  {moment(mail.dt_envio).format('DD/MM/YYYY, hh:mm')}
                  ,
                  {' '}
                  <br />
                  {' '}
                  Para
                  {' '}
                  {mail.emailsEnviados}
                  {' '}
                  <br />
                  Situação de Envio:
                  {' '}
                  {mail.situacao}
                  {' '}
                  <br />
                  __________
                  {' '}
                </Col>
              </Row>
            ))}
          </Item>
        </>
      );
    }

    return <Skeleton active />;
  };

  return (
    <StyledCardPrimary
      title="Detalhes da Solicitação"
      headStyle={{
        textAlign: 'center',
        fontWeight: 'bold',
        background: '#74B4C4',
        fontSize: '1.3rem',
      }}
      bodyStyle={{ padding: 5 }}
    >
      {fetchingData ? (
        <Row>
          <Col>
            <PageLoading />
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col span={8} style={{ padding: 10 }}>
              <Descriptions column={1} bordered size="small">
                {renderDescription01()}
              </Descriptions>
            </Col>
            <Col span={8} style={{ padding: 10 }} />
            <Col span={8} style={{ padding: 10 }}>
              <Descriptions column={1} bordered size="small">
                {renderDescription02()}
              </Descriptions>
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{ padding: 10 }}>
              <Descriptions column={1} bordered size="small">
                {renderDescription1()}
              </Descriptions>
            </Col>
            <Col span={8} style={{ padding: 10 }}>
              <Descriptions column={1} bordered size="small">
                {renderDescription2()}
              </Descriptions>
            </Col>
            <Col span={8} style={{ padding: 10 }}>
              <Descriptions column={1} bordered size="small">
                {renderDescription3()}
              </Descriptions>
            </Col>
          </Row>
        </>
      )}
    </StyledCardPrimary>
  );
}

export default React.memo(Solicitacao);
