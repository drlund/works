import React from 'react';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Tooltip, Typography } from 'antd';

const { Text } = Typography;

const TabelaTemplate = (props) => {
  return [
    {
      title: 'Histórico',
      width: '50%',
      dataIndex: 'tipo_historico',
      key: 'tipo_historico',
      render: (text, record) => {
        return (
          <Text>{record.tipo_historico.historico}</Text>
        )
      }
    },
    {
      title: 'Título',
      width: '30%',
      dataIndex: 'curto',
      key: 'curto',
      render: (text, record) => {
        return (
          <Text>{record.curto}</Text>
        )
      }
    },
    {
      title: 'Válido',
      width: '10%',
      dataIndex: 'valido',
      key: 'valido',
      render: (text, record) => {
        return (
          <Text>{record.valendo}</Text>
        )
      }
    },
    {
      title: 'Ação',
      width: '10%',
      dataIndex: 'acao',
      key: 'acao',
      render: (text, record) => {
        return (
          <div style={{ flex: 1 }}>
            <Tooltip title="Editar">
              <Button shape='circle' icon={<FormOutlined />} onClick={() => props.metodos.editar(record.id)} />
            </Tooltip>
            <Tooltip title="Excluir">
              <Popconfirm
                placement="topRight"
                title='Confirmar remoção do template?'
                onConfirm={() => props.metodos.deletar(record.id)}
                okText="Sim"
                cancelText="Nâo"
              >
                <Button shape='circle' icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </div>
        )
      }
    },
  ]
}

export default TabelaTemplate;