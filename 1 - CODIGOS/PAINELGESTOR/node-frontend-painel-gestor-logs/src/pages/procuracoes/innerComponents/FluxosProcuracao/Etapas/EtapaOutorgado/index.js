import {
  Button, Card, Col, Input, message, Row, Space, Typography
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useSpinning } from 'components/SpinningContext';
import { matriculaParcialRegex } from '../../../shared/matriculaParcialRegex';
import DadosNovoOutorgado from '../Displays/DadosOutorgado';
import pesquisarOutorgado from './apiCalls/pesquisarOutorgado';
import { devtoolConsole } from './devtools/devtoolConsole';

const { Paragraph } = Typography;
const { Search } = Input;

/**
 * @param {Procuracoes.CurrentStepParameters<Funci>} props
 */
const EtapaOutorgado = ({
  dadosEtapa,
  subtrairStep,
  adicionarStep,
  tipoFluxo,
  isFirstStep,
}) => {

  const [novoOutorgado, setNovoOutorgado] = useState(/** @type {Funci} */(null));
  const [matriculaPesquisando, setMatriculaPesquisando] = useState(/** @type {string} */(null));
  const { setLoading } = useSpinning();

  const onRemoveOutorgado = () => {
    setNovoOutorgado(null);
  };

  useEffect(() => {
    if (dadosEtapa) {
      setNovoOutorgado(dadosEtapa);
    }
    devtoolConsole();
  }, [dadosEtapa]);

  /**
   * @param {string} value
   */
  const handleOnSearch = (value) => {
    setLoading(true);
    pesquisarOutorgado(value, tipoFluxo.idFluxo)
      .then((dadosOutorgadoPesquisado) => {
        setNovoOutorgado(dadosOutorgadoPesquisado);
        setMatriculaPesquisando(null);
      })
      .catch((error) => {
        message.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * @param {{target: { value: string }}} props
   */
  const handleSearchChange = ({ target: { value: matricula } }) => {
    if (matricula.match(matriculaParcialRegex)) {
      setMatriculaPesquisando(matricula);
    }
  };

  return (
    <Row gutter={[0, 20]}>
      {novoOutorgado === null ? (
        <>
          <Col span={24}>
            <Paragraph>
              Utilize o campo abaixo para buscar o funcionário através do número da matrícula.
            </Paragraph>
          </Col>
          <Col span={6} style={{ minWidth: '25%', maxWidth: '300px' }}>
            <Search
              placeholder="Matrícula"
              value={matriculaPesquisando}
              onChange={handleSearchChange}
              onSearch={handleOnSearch}
            />
          </Col>
        </>
      ) : null}

      {novoOutorgado && (
        <Col span={24}>
          <Card
            type="inner"
            title="Outorgado"
            extra={(
              <Button danger onClick={onRemoveOutorgado}>
                Remover Outorgado
              </Button>
            )}
          >
            <DadosNovoOutorgado
              outorgado={novoOutorgado}
            />
          </Card>
        </Col>
      )}
      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button
              type="default"
              disabled={isFirstStep === true}
              onClick={subtrairStep}
            >
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button
              type="default"
              onClick={() => {
                adicionarStep(novoOutorgado);
              }}
            >
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaOutorgado;
