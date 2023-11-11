import {
  Button,
  Col,
  Row,
  Space
} from 'antd';
import React, { useEffect } from 'react';

import { useCartorios } from '@/pages/procuracoes/contexts/CartorioContext';
import { useSelectCartorio } from '@/pages/procuracoes/contexts/CartorioContext/useSelectCartorio';
import { useSpinning } from 'components/SpinningContext';

import DadosCartorio from '../Displays/DadosCartorio';
import ModalCadastrarCartorio from './ModalCadastrarCartorio';

/**
 * @typedef {Procuracoes.Cartorio} Cartorio
 */

/**
 * @param {Procuracoes.CurrentStepParameters<Cartorio>} props
 */
const EtapaCartorio = ({
  subtrairStep,
  adicionarStep,
  dadosEtapa,
  isLastStep,
}) => {
  const { shouldLoading } = useCartorios();
  const { setLoading } = useSpinning();
  const { cartorio, setCartorio, SelectCartorio } = useSelectCartorio();

  useEffect(() => {
    if (dadosEtapa) {
      setCartorio(dadosEtapa);
    }
  }, [dadosEtapa, setCartorio]);

  useEffect(() => {
    // cartorios vão começar o fetching antes deste componente
    // então só mostra o spinner caso necessário
    setLoading(shouldLoading);
  }, [shouldLoading]);

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Space>
          <SelectCartorio />
          <ModalCadastrarCartorio />
        </Space>
      </Col>
      {cartorio !== null && (
        <Col span={24}>
          <DadosCartorio cartorio={cartorio} />
        </Col>
      )}
      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button
              type="default"
              disabled={isLastStep}
              onClick={subtrairStep}
            >
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button type="default" onClick={() => adicionarStep(cartorio)}>
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaCartorio;
