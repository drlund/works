import {
  Button, Col, Input, Modal, Row, Typography
} from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { DEVOnlyNotProduction } from 'components/DEVOnlyNotProduction';
import { baseMapProcuracao } from './helpers/forGeneratedData/baseMapProcuracao';
import { createReplacerMap } from './helpers/forGeneratedData/createReplacerMap';
import { pick } from './helpers/others/pick';
import { put } from './helpers/others/put';

/**
 * @param {{
 *  keyList: { [key: string]: string }[],
 *  dadosProcuracao: Partial<Procuracoes.DadosProcuracao>,
 *  changeDadosProcuracao: import('./ReadOnly/changeDadosProcuracao').ChangeDadosClosureFunc,
 * }} props
 */
export const ModalEditarMinuta = ({
  keyList,
  dadosProcuracao,
  changeDadosProcuracao,
}) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({
    ...dadosProcuracao.dadosMinuta.customData,
  });

  const baseMap = baseMapProcuracao(dadosProcuracao);
  const replaceMap = createReplacerMap(dadosProcuracao);

  const reducedKeylist = keyList.reduce((acc, { minuta, display }) => {
    if (!acc.map[minuta]) {
      acc.map[minuta] = true;
      acc.tuples.push([minuta, display]);
    }
    return acc;
  }, {
    tuples: /** @type {[string, string][]} */([]),
    map: /** @type {{ [key: string]: boolean }} */({}),
  }).tuples;

  const itemsArray = reducedKeylist
    .map(([key, display]) => [
      display,
      key,
      // valor dos dados
      /** @type {string} */ (pick(key, baseMap)),
      // valor da customização
      /** @type {string} */ (pick(`custom.${key}`, replaceMap))
    ]);

  /**
   * @param {{ target: { name: string, value: string } }} props
   */
  const handleChanges = ({ target }) => {
    const { name, value } = target;
    setData((old) => {
      put(old, name, value);
      return { ...old };
    });
  };

  const handleOk = () => {
    changeDadosProcuracao(data);
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Editar Minuta
      </Button>
      <Modal
        title="Edição dos dados da minuta"
        open={visible}
        keyboard={false}
        onOk={handleOk}
        okText="Confirmar"
        cancelText="Cancelar"
        width="70%"
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Typography.Paragraph>
              Edite as informações das minutas caso seja necessário.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Se houver campos sem informações, estes são obrigatórios.
            </Typography.Paragraph>
            <DEVOnlyNotProduction>
              <Button
                onClick={() => {
                  itemsArray.forEach(([, key, base, replace]) => {
                    if (!base && !replace) {
                      handleChanges({
                        target: {
                          name: key,
                          value: `Mock-${key}`,
                        }
                      });
                    }
                  });
                }}
              >
                Dev: preencher todos os campos necessários
              </Button>
            </DEVOnlyNotProduction>
          </Col>

          <Col span={24} style={{ display: 'grid', rowGap: '0.5em' }}>
            <Row gutter={[16, 16]}>
              <Col
                span={8}
                // @ts-ignore
                align="middle"
              >
                <strong>Nome do Campo</strong>
              </Col>
              <Col
                span={8}
                // @ts-ignore
                align="middle"
              >
                <strong>Valor de base</strong>
              </Col>
              <Col
                span={8}
                // @ts-ignore
                align="middle"
              >
                <strong>Valor a ser usado</strong>
              </Col>
            </Row>
            {
              itemsArray.map(([display, key, base, replace]) => {
                const required = !base && !replace;

                return (
                  <Row gutter={[16, 16]} key={key}>
                    <Col span={8}>
                      <CustomLabel required={required} htmlFor={key}>{display}</CustomLabel>
                    </Col>
                    <Col span={8}>
                      <Input defaultValue={base} disabled />
                    </Col>
                    <Col span={8}>
                      <Input
                        name={key}
                        defaultValue={replace}
                        status={required ? 'warning' : ''}
                        onChange={handleChanges}
                      />
                    </Col>
                  </Row>
                );
              })
            }
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const CustomLabel = styled.label`
  &:before {
    content: ${/** @param {{ required: boolean }} props */({ required }) => (required ? '"* "' : '')};
    color: red;
  }
`;
