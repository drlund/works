import {
  Button, Col, message, Row, Select, Space
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useSpinning } from 'components/SpinningContext';
import DadosSubsidiaria from '../Displays/DadosSubsidiaria';
import getListaSubsidiarias from './apiCalls/getListaSubsidiarias';
import ModalCadastrarSubsidiaria from './ModalCadastrarSubsidiaria';

const { Option } = Select;

/**
 * @param {Procuracoes.CurrentStepParameters<Procuracoes.SubsidiariaCadastro>} props
 */
const EtapaSubsidiaria = ({ subtrairStep, adicionarStep, dadosEtapa }) => {

  const [listaSubsidiarias, setListaSubsidiarias] = useState(/** @type {Procuracoes.SubsidiariaCadastro[]} */(null));
  const [subsidiaria, setSubsidiaria] = useState(/** @type {Procuracoes.SubsidiariaCadastro} */(null));
  const { setLoading } = useSpinning();

  useEffect(() => {
    if (dadosEtapa) {
      setSubsidiaria(dadosEtapa);
    }
  }, [dadosEtapa, setSubsidiaria]);

  const onGetListaSubsidiarias = () => {
    setLoading(true);
    getListaSubsidiarias()
      .then((fetchedListaSubsidiarias) => {
        setListaSubsidiarias(fetchedListaSubsidiarias);
      })
      .catch((error) => {
        message.error(
          typeof error === 'string'
            ? error
            : 'Erro ao recuperar lista de subsidiárias',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (listaSubsidiarias === null) {
      onGetListaSubsidiarias();
    }
  }, [listaSubsidiarias]);

  /**
   * @param {number} value
   */
  const handleChangeSubsidiaria = (value) => {
    const subsidiariaSelecionada = listaSubsidiarias.find(
      (item) => item.id === value
    );
    setSubsidiaria(subsidiariaSelecionada);
  };

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Space>
          <Select
            placeholder="Subsidária"
            onChange={handleChangeSubsidiaria}
            style={{ width: 250 }}
          >
            {listaSubsidiarias?.map(
              (item) => <Option key={item.id} value={item.id}>{item.nomeReduzido}</Option>
            ) || null}
          </Select>
          <ModalCadastrarSubsidiaria
            onGetListaSubsidiarias={onGetListaSubsidiarias}
          />
        </Space>
      </Col>
      {subsidiaria !== null && (
        <Col span={24}>
          <DadosSubsidiaria subsidiaria={subsidiaria} />
        </Col>
      )}
      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button type="default" onClick={subtrairStep}>
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button type="default" onClick={() => adicionarStep(subsidiaria)}>
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaSubsidiaria;
