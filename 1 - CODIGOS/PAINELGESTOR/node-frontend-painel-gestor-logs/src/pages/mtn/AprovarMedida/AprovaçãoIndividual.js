import React, { useState } from 'react';
import { Card, Tooltip, Space, message } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  UndoOutlined,
} from '@ant-design/icons';

import IntegerSort from 'utils/IntegerSort';
import ModalAprovacaoIndividual from './ModalAprovacaoIndividual';

import { devolverEnvolvidoParaAnalise } from './apiCalls/devolverEnvolvidoParaAnalise';

import styles from './aprovarMedida.module.scss';

function AprovaçãoIndividual({
  pareceres,
  onGetPareceres,
  loading,
  setLoading,
}) {
  const [idEnvolvidoAprovando, setIdEnvolvidoAprovando] = useState(null);

  const onDevolverParaAnalise = ({ idEnvolvido }) => {
    setLoading(true);
    devolverEnvolvidoParaAnalise(idEnvolvido)
      .then(() => {
        message.success('Envolvido devolvido para análise');
        onGetPareceres();
      })
      .catch((e) => {
        console.log(e);
        message.error('Erro ao devolver envolvido para análise');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      dataIndex: 'nrMtn',
      title: 'Nº MTN',
    },
    {
      dataIndex: 'matricula',
      title: 'Matrícula',
    },
    {
      dataIndex: 'envolvido',
      title: 'Envolvido',
    },
    {
      dataIndex: 'medidaPrevista',
      title: 'Medida Prevista',
    },
    {
      dataIndex: 'medida',
      title: 'Medida',
    },
    {
      dataIndex: 'analista',
      title: 'Analista',
    },
    {
      dataIndex: 'prazoPendenciaAnalise',
      title: 'Pend. Mais Antiga',
      defaultSortOrder: 'descend',
      sorter: (a, b) =>
        IntegerSort(a.prazoPendenciaAnalise, b.prazoPendenciaAnalise),
      render: (text, record) => {
        return <p>{record.prazoPendenciaAnalise}</p>;
      },
    },
    {
      title: 'Ações',
      align: 'center',
      render: (record) => (
        <Space>
          <Tooltip title="Visualizar MTN">
            <a
              href={`analisar/${record.idMtn}?idEnvolvido=${record.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <EyeOutlined className={`link-color ${styles.iconeAcao}`} />
            </a>
          </Tooltip>
          <Tooltip
            title="Aprovar Análise"
            onClick={() => {
              setIdEnvolvidoAprovando(record.id);
            }}
          >
            <FileDoneOutlined className={`link-color ${styles.iconeAcao}`} />
          </Tooltip>
          <Tooltip title="Devolver para análise">
            <UndoOutlined
              onClick={() => {
                onDevolverParaAnalise({ idEnvolvido: record.id });
              }}
              className={`link-color ${styles.iconeAcao} ${styles.iconeAtencao}`}
            />
          </Tooltip>
        </Space>
      ),
    },

    {
      title: 'Dedip',
      align: 'center',
      render: (record) => (
        <Space>
          {record.falha_consulta_dedip === true ? (
            <Tooltip title="Pesquisa automatizada à Dedip retornou erro.">
              <ExclamationCircleOutlined style={{ color: 'red' }} />
            </Tooltip>
          ) : null}
          {record.falha_consulta_dedip === false ? (
            <Tooltip title="Dedip consultada com sucesso e medida de acordo.">
              <CheckCircleOutlined style={{ color: 'green' }} />
            </Tooltip>
          ) : null}
          {record.falha_consulta_dedip === null ? (
            <Tooltip title="Consulta não se aplica a medida aplicada.">
              <CheckCircleOutlined style={{ color: 'gray' }} />
            </Tooltip>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Card type="inner" title="Aprovação Individual">
      <SearchTable dataSource={pareceres} columns={columns} />
      <ModalAprovacaoIndividual
        onGetPareceres={onGetPareceres}
        idEnvolvidoAprovando={idEnvolvidoAprovando}
        setIdEnvolvidoAprovando={setIdEnvolvidoAprovando}
      />
    </Card>
  );
}

export default AprovaçãoIndividual;
