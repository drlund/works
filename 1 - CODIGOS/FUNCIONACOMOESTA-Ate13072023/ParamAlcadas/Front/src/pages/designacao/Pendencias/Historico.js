import React, { useState } from 'react';
import {
  Timeline,
  Row,
  Col,
  Avatar,
  Tag,
  Alert,
  Typography,
  Divider,
  message,
  Button,
} from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { getProfileURL } from 'utils/Commons';
import useEffectOnce from 'utils/useEffectOnce';

import PageLoading from 'components/pageloading/PageLoading';
import StyledCardPrimary from 'components/styledcard/StyledCard';

import {
  getHistorico,
  downloadDocsEnviados,
} from 'services/ducks/Designacao.ducks';

import EditorTexto from './EditorTextoReadOnly';

const { Text } = Typography;

function Historico(props) {
  const dispatch = useDispatch();

  const [mode, setMode] = useState();
  const [historico, setHistorico] = useState();

  useEffectOnce(() => {
    const { mode: thisMode, id } = props;
    if (thisMode) {
      setMode(thisMode);
    } else {
      setMode('alternate');
    }
    obterHistorico(id);
  });

  const baixar = (idSolicitacao, documento) => (
    dispatch(downloadDocsEnviados(idSolicitacao, documento)))
    .then(() => true)
    .catch((error) => message.error(error));

  const obterHistorico = (id) => (
    getHistorico(id)
      .then((thisHistorico) => setHistorico(thisHistorico))
      .catch((error) => message.error(error)));

  const renderItem = () => {
    if (historico) {
      const history = historico;

      return history.map((elem) => {
        const color = elem.tipo ? '#ECECEC' : '';

        return (
          <div key={elem.id} style={{ backgroundColor: color, paddingTop: 10, paddingBottom: 10 }}>
            <Row>
              <Col offset={19}>
                {elem.tipo && <Text code>Confidencial</Text>}
              </Col>
            </Row>
            <Row>
              <Col>
                <Timeline.Item
                  dot={<Avatar src={getProfileURL(elem.matricula)} />}
                  key={elem.id}
                >
                  <Row>
                    <Col>
                      <Tag>{elem.matricula}</Tag>
                      {' '}
                      {elem.nome}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Tag>{elem.funcao}</Tag>
                      {' '}
                      {elem.nome_funcao}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Tag>{elem.prefixo}</Tag>
                      {' '}
                      {elem.nome_prefixo}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Text code>{elem.tipoHistorico.historico}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div
                        style={{
                          backgroundColor: '#fdffde',
                          border: '1px dotted black',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <EditorTexto
                          value={(elem.documento?.texto)}
                        />
                        <br />
                        {elem.documento.documento.map((doc) => (
                          <React.Fragment key={doc.documento}>
                            <Button
                              type="link"
                              onClick={() => baixar(elem.id_solicitacao, doc)}
                            >
                              <Text key={doc.documento}>
                                {doc.documento}
                                .
                                {doc.extensao}
                                <br />
                              </Text>
                            </Button>
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                      {false && (
                        <Alert
                          message={(
                            <Text>
                              {elem.documento ? (
                                <>
                                  <EditorTexto
                                    value={(elem.documento?.texto)}
                                  />
                                  <br />
                                  {elem.documento.documento.map((doc) => (
                                    <Text key={doc.documento}>
                                      {doc.documento}
                                      .
                                      {doc.extensao}
                                      <br />
                                    </Text>
                                  ))}
                                </>
                              ) : (
                                ''
                              )}
                            </Text>
                          )}
                          type="info"
                        />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: 'right' }}>
                      em
                      {' '}
                      <Tag>{moment(elem.data_hora).format('DD/MM/YYYY, [às] HH[h]mm')}</Tag>
                    </Col>
                  </Row>
                  <Divider />
                </Timeline.Item>
              </Col>
            </Row>
          </div>
        );
      });
    }

    return <PageLoading />;
  };

  function History() {
    const { id } = props;
    return (
      <StyledCardPrimary
        title="Histórico"
        headStyle={{
          textAlign: 'center',
          fontWeight: 'bold',
          background: '#74B4C4',
          fontSize: '1.3rem',
        }}
        bodyStyle={{ padding: 10 }}
      >
        <Row>
          <Col span={14} offset={5}>
            <Timeline key={id} mode={mode}>
              {renderItem()}
            </Timeline>
          </Col>
        </Row>
      </StyledCardPrimary>
    );
  }

  return History();
}
export default React.memo(Historico);
