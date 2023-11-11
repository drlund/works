import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message, Tooltip, Button, Checkbox } from "antd";
import { FormOutlined, RedoOutlined } from "@ant-design/icons";
import DateBrSort from "utils/DateBrSort";
import IntegerSort from "utils/IntegerSort";
import AlfaSort from "utils/AlfaSort";
import { Link } from "react-router-dom";
import { fetchPendentesSuper } from "services/ducks/Mtn.ducks";
import SearchTable from "components/searchtable/SearchTable";

const columns = [
  {
    dataIndex: "nrMtn",
    title: "Nr. MTN",
    sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
    textSearch: true,
    render: (text, record) => {
      return <p>{record.nrMtn}</p>;
    },
  },

  {
    dataIndex: "nomeVisao",
    title: "Visão",
    sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
    render: (text, record) => {
      return <p>{record.nomeVisao}</p>;
    },
  },

  {
    dataIndex: "qtdEnvolvidos",
    title: "Envolvidos",
    searchText: false,
    sorter: (a, b) => IntegerSort(a.qtdEnvolvidos, b.qtdEnvolvidos),
    render: (text, record) => {
      return <p>{record.qtdEnvolvidos}</p>;
    },
  },

  {
    dataIndex: "criadoEm",
    title: "Data Criação",
    sorter: (a, b) => DateBrSort(a.criadoEm, b.criadoEm),
    render: (text, record) => {
      return <p>{record.criadoEm}</p>;
    },
  },

  {
    title: "Analista Responsavel (Ordenação por nome)",
    sorter: (a, b) => {
      return AlfaSort(
        a.lock ? a.lock.nomeAnalista : "Nenhum Analista",
        b.lock ? b.lock.nomeAnalista : "Nenhum Analista"
      );
    },
    render: (text, record) => {
      return (
        <p>
          {record.lock === undefined || record.lock === null
            ? "Nenhum analista"
            : `${record.lock.matriculaAnalista} - ${record.lock.nomeAnalista}`}
        </p>
      );
    },
  },

  {
    dataIndex: "prazoPendenciaAnalise",
    title: "Pend. Mais Antiga",
    defaultSortOrder: "descend",
    sorter: (a, b) =>
      IntegerSort(a.prazoPendenciaAnalise, b.prazoPendenciaAnalise),
    render: (text, record) => {
      return <p>{record.prazoPendenciaAnalise}</p>;
    },
  },

  {
    title: "Ações",
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Conduzir Análise">
          <Link to={"analisar/" + record.id}>
            <FormOutlined className="link-color" />
          </Link>
        </Tooltip>
      );
    },
  },
];

const MtnPendentesSuper = (props) => {
  const [mtns, setMtns] = useState([]);
  const [somenteMeus, setSomenteMeus] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const updateMtns = async () => {
      try {
        const fetchedMtns = await fetchPendentesSuper(somenteMeus);
        setMtns(fetchedMtns);
        setFetching(false);
      } catch (error) {
        message.error(error);
      }
    };
    if (fetching) {
      updateMtns();
    }
  }, [fetching, somenteMeus]);

  useEffect(() => {
    setFetching(true);
  }, [somenteMeus]);

  return (
    <Spin spinning={fetching}>
      <Row>
        <Col span={24}>
          <Checkbox
            checked={somenteMeus}
            onChange={() => setSomenteMeus(!somenteMeus)}
          >
            Somente meus avocados?
          </Checkbox>
          <Button
            icon={<RedoOutlined />}
            loading={fetching}
            style={{ marginBottom: "15px", marginRight: "25px" }}
            onClick={() => setFetching(true)}
          />
        </Col>
        <Col span={24}>
          <SearchTable
            columns={columns}
            dataSource={mtns}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default MtnPendentesSuper;
