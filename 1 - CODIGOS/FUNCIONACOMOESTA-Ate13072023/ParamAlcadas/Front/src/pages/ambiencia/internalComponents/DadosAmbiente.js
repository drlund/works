import React from 'react';
import {
  Col,
  Row,
  Card,
  Typography,
  Divider,
  Space,
  Rate,
  Image,
  Button,
  Tag,
} from 'antd';
import styles from '../Ambiencia.module.css';

const { Title, Paragraph, Text } = Typography;

const DadosAmbiente = ({
  dadosAmbienteAtual,
  avaliacaoAtual,
  setAvaliacaoAtual,
  onChangeAmbiente,
}) => {
  

  return (
    <Col span={24}>
      <Card
        title="Avaliar ambiente"
        actions={[
          <div className={styles.wrapperActionsCard}>
            <Row>
              <Col span={18}>
                <Space size={'large'} align="center">
                  <Text
                    level={5}
                    className={styles.tituloAvaliacao}
                    style={{
                      fontSize: 18,
                      marginBottom: '0px !important',
                      fontWeight: 'bold',
                    }}
                    strong
                  >
                    Avalie aqui o ambiente com notas entre 1 e 5 estrelas:{' '}
                  </Text>
                  <Rate
                    value={avaliacaoAtual}
                    style={{ fontSize: 25 }}
                    onChange={(value) => setAvaliacaoAtual(value)}
                  />
                </Space>
              </Col>
              <Col span={6}>
                <Button
                  onClick={() => {
                    onChangeAmbiente();
                  }}
                  type="primary"
                  disabled={avaliacaoAtual === 0}
                >
                  Salvar Avaliação
                </Button>
              </Col>
            </Row>
          </div>,
        ]}
      >
        <Row gutter={[32, 32]} justify="space-around">
          {dadosAmbienteAtual.imagens.map((imagem, index) => {
            return (
              <Col flex="auto" span={8} key={index}>
                <Image
                  width={'100%'}
                  height={275}
                  src={imagem.url}
                  style={{ objectFit: 'cover' }}
                />
                <Typography.Text>Incluído em: <Tag>{imagem.dataInclusao}</Tag></Typography.Text>
              </Col>
            );
          })}
          <Divider plain />
          <Col span={24}>
            <Row gutter={[0, 32]}>
              <Col span={4}>
                <Title level={5}>Ambiente:</Title>
                <Paragraph>{dadosAmbienteAtual.ambienteDescricao}</Paragraph>
              </Col>
              <Col span={24}>
                <Title level={5}>Descrição ambiente:</Title>
                <Paragraph>
                  {dadosAmbienteAtual.ambienteTextoInstrucao}
                </Paragraph>
              </Col>
              <Col span={24}>
                <Title level={5}>Critérios de Avaliação:</Title>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {dadosAmbienteAtual.ambienteOrientacao}
                </Paragraph>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default DadosAmbiente;
