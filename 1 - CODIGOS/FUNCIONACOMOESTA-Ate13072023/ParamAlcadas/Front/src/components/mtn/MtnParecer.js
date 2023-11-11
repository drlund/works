/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Comment, Card, Typography, Alert, Row, Col, Collapse } from 'antd';
import { getProfileURL } from 'utils/Commons';
import ListaAnexos from 'components/listaAnexos/ListaAnexos';
import { connect } from 'react-redux';
import { downloadAnexo } from 'services/ducks/Mtn.ducks';
import ModalVersionarOcorrencia from './ModalVersionarOcorrencia';

import styles from './mtnParecer.module.scss';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

class MtnParecer extends Component {
  render() {
    const txtMedida = this.props.envolvido.medidaSelecionada
      ? this.props.envolvido.medidaSelecionada.txtMedida
      : 'Medida não disponível';
    return (
      <>
        {this.props.envolvido.pendenteAprovacao ? (
          <Alert message=" Parecer pendente de aprovação" type="warning" />
        ) : null}
        <Card
          type="inner"
          className={styles.cardParecer}
          title={
            this.props.envolvido.pendenteAprovacao
              ? 'Parecer pendente de aprovação '
              : 'Parecer Aprovado'
          }
          extra={
            this.props.envolvido.versionado ||
            this.props.envolvido.pendenteAprovacao === true ? null : (
              <ModalVersionarOcorrencia
                idMtn={this.props.envolvido.idMtn}
                idEnvolvido={this.props.envolvido.idEnvolvido}
                refreshEnvolvidos={this.props.refreshEnvolvidos}
              />
            )
          }
        >
          <Comment
            author={`${this.props.envolvido.matRespAnalise} - ${this.props.envolvido.nomeRespAnalise}`}
            avatar={getProfileURL(this.props.envolvido.matRespAnalise)}
            content={
              <div style={{ whiteSpace: 'pre-line' }}>
                {this.props.envolvido.txtAnalise}
              </div>
            }
            datetime={this.props.envolvido.respondidoEm}
          />
          <Text strong>
            Medida selecionada: {txtMedida}
            {this.props.envolvido.nrGedip
              ? ` - Nr. Gedip: ${this.props.envolvido.nrGedip}`
              : ''}
          </Text>
          <ListaAnexos
            downloadAnexo={this.props.downloadAnexo}
            anexos={this.props.envolvido.anexos}
          />
        </Card>

        {Array.isArray(this.props?.envolvido?.aprovacoesMedida) &&
          this.props.envolvido.aprovacoesMedida.length > 0 && (
            <Collapse>
              <Panel header="Aprovações">
                <Row gutter={[0, 20]}>
                  {this.props.envolvido.aprovacoesMedida.map((aprovacao) => (
                    <Col span={24}>
                      <Paragraph>
                        <Text strong>Aprovado Por: </Text>
                        <Text>{`${aprovacao.analistaMatricula} - ${aprovacao.analistaNome}`}</Text>
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Alterado: </Text>
                        <Text>{`${
                          aprovacao.alterado === true ? 'Sim' : 'Não'
                        }`}</Text>
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Aprovado Em: </Text>
                        <Text>{`${aprovacao.aprovadoEm}`}</Text>
                      </Paragraph>
                      {aprovacao.alterado && (
                        <>
                          <Paragraph>
                            <Text strong>Medida Original: </Text>
                            <Text>{`${aprovacao.medidaProposta.txtMedida}`}</Text>
                          </Paragraph>
                          <Paragraph>
                            <Text strong>Medida Original: </Text>
                            <Text>{`${aprovacao.medidaAprovada.txtMedida}`}</Text>
                          </Paragraph>
                        </>
                      )}
                    </Col>
                  ))}
                </Row>
              </Panel>
            </Collapse>
          )}
      </>
    );
  }
}

export default connect(null, { downloadAnexo })(MtnParecer);
