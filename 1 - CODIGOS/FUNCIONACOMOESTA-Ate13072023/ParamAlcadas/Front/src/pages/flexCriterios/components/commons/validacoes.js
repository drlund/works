import React from 'react';
import { Button, Descriptions, Space } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import BBSpining from 'components/BBSpinning/BBSpinning';
// import Movimentacao from './cardMovimentacao';
// import Validacao from './cardValidacao';
import { DescriptionsValidacao } from '../../styles';
import estilos from '../../flexCriterios.module.css';
import ModalQualificacao from '../incluir/inclusaoModalQualificacao';

const info = <InfoCircleFilled style={{ color: '#1890ff' }} />;
const check = <CheckCircleFilled style={{ color: '#52c41a' }} />;
const close = <CloseCircleFilled style={{ color: '#f5222d' }} />;
const pit = 'Pit +';
const qualif = 'Qualificado';

export default function Validacoes({ funcionarioEnvolvido, loading }) {
  return (
    funcionarioEnvolvido?.analise && (
      <BBSpining spinning={loading}>
        <div className={estilos.descricaoLinhaFlex}>
          <DescriptionsValidacao
            title="Dados da movimentação"
            column={1}
            className={estilos.descricaoCheia}
            bordered
          >
            <Descriptions.Item
              key="Tipo de Movimentação"
              label="Tipo de Movimentação"
              className={estilos.descricaoLinha}
            >
              {funcionarioEnvolvido?.analise?.tipoMovimentacao}
            </Descriptions.Item>
            {funcionarioEnvolvido?.analise?.movimentacao.map((item) => (
              <Descriptions.Item
                key={item.nome}
                label={item.label}
                className={estilos.descricaoLinha}
              >
                <Space>
                  {item.valor}
                  {item.flag ? check : close}
                </Space>
              </Descriptions.Item>
            ))}
            <Descriptions.Item
              key={pit}
              label={pit}
              className={estilos.descricaoLinhaQuarter}
            >
              <Space>
                {funcionarioEnvolvido?.analise?.pit?.valor}
                <Button
                  type="text"
                  shape="circle"
                  icon={info}
                  onClick={() =>
                    ModalQualificacao(
                      funcionarioEnvolvido?.analise.pit.lista,
                      pit,
                    )
                  }
                />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item
              key={qualif}
              label={qualif}
              className={estilos.descricaoLinhaQuarter}
            >
              <Space>
                {funcionarioEnvolvido?.analise?.qualificado?.valor}
                <Button
                  type="text"
                  shape="circle"
                  icon={info}
                  onClick={() =>
                    ModalQualificacao(
                      funcionarioEnvolvido?.analise.qualificado.lista,
                      qualif,
                    )
                  }
                />
              </Space>
            </Descriptions.Item>
          </DescriptionsValidacao>
        </div>
        <div className={estilos.descricaoLinhaFlex}>
          <DescriptionsValidacao
            title="Validações"
            column={2}
            className={estilos.descricaoCheia}
            bordered
          >
            {funcionarioEnvolvido?.analise?.validacao.map((item) => (
              <Descriptions.Item
                key={item.nome}
                label={item.label}
                className={estilos.descricaoLinhaQuarter}
              >
                <Space>
                  {item.valor}
                  {item.flag ? check : close}
                </Space>
              </Descriptions.Item>
            ))}
          </DescriptionsValidacao>
        </div>
      </BBSpining>
    )
  );
}
