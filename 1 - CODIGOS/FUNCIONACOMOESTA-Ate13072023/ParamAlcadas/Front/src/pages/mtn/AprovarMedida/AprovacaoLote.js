import React, { useState } from 'react';
import { Card, Button, Checkbox, message, Space, Tooltip } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import {
  UndoOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import IntegerSort from 'utils/IntegerSort';

import { aprovarMedidaLote } from './apiCalls/aprovarMedidaLote';
import { devolverEnvolvidoParaAnalise } from './apiCalls/devolverEnvolvidoParaAnalise';

import styles from './aprovarMedida.module.scss';

function AprovacaoLote({ pareceres, onGetPareceres, loading, setLoading }) {
  const [selecionados, setSelecionados] = useState([]);

  const onAprovarEmLote = () => {
    setLoading(true);
    aprovarMedidaLote(selecionados)
      .then(() => {
        message.success('Medidas aprovadas com sucesso');
        onGetPareceres();
        setSelecionados([]);
      })
      .catch(() => {
        message.error('Erro ao aprovar pareceres em lote.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDevolverParaAnalise = ({ idEnvolvido }) => {
    setLoading(true);
    devolverEnvolvidoParaAnalise(idEnvolvido)
      .then(() => {
        message.success('Envolvido devolvido para análise');
        onGetPareceres();
        setSelecionados([]);
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
          <Tooltip title="Devolver para análise">
            <UndoOutlined
              onClick={() => {
                onDevolverParaAnalise({ idEnvolvido: record.id });
              }}
              className={`link-color ${styles.iconeAcao} ${styles.iconeAtencao}`}
            />
          </Tooltip>
          <Tooltip title="Visualizar MTN">
            <a
              href={`analisar/${record.idMtn}?idEnvolvido=${record.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <EyeOutlined className={`link-color ${styles.iconeAcao}`} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Seleção',
      align: 'center',
      render: (record) => (
        <Space>
          <Checkbox
            checked={selecionados.includes(record.id)}
            onChange={(e) =>
              onCheckClick({
                checked: e.target.checked,
                id: record.id,
              })
            }
          />
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

  const onCheckClick = ({ checked, id }) => {
    if (checked === true) {
      const newSelecionados = [...selecionados];
      newSelecionados.push(id);
      setSelecionados(newSelecionados);
    }

    if (checked === false) {
      const newSelecionados = selecionados.filter(
        (aprovacao) => aprovacao !== id,
      );
      setSelecionados(newSelecionados);
    }
  };

  return (
    <Card
      type="inner"
      title="Aprovação em Lote"
      extra={
        <Button
          loading={loading}
          type="primary"
          size="small"
          disabled={selecionados.length === 0}
          onClick={() => onAprovarEmLote()}
        >
          Aprovar Selecionadas
        </Button>
      }
    >
      <SearchTable dataSource={pareceres} columns={columns} />
    </Card>
  );
}

export default AprovacaoLote;
