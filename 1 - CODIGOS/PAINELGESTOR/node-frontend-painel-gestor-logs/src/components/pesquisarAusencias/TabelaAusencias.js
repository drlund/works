import React, { useEffect } from "react";
import DateBrSort from "utils/DateBrSort";
import SearchTable from "components/searchtable/SearchTable";
import { Avatar, Card, Row, Col, Typography } from "antd";
import { getProfileURL } from "utils/Commons";
import style from "./tabelaAusencia.module.css";

const { Paragraph } = Typography;

const columns = [
  {
    dataIndex: "dataInicio",
    align: "center",
    title: "Início",
    sorter: (a, b) => DateBrSort(a.dataInicio, b.dataInicio),
  },
  {
    dataIndex: "dataFim",
    align: "center",
    title: "Fim",
    render: (text, record) => {
      return record.qtdDias > 1000000 ? "Indefinido" : record.dataFim;
    },
    sorter: (a, b) => DateBrSort(a.dataFim, b.dataFim),
  },
  {
    align: "center",
    title: "Qtd. Dias",
    render: (text, record) => {
      return record.qtdDias > 1000000 ? "Indefinido" : record.qtdDias;
    },
    sorter: (a, b) => a.qtdDias >= b.qtdDias,
  },
];

const TabelaAusencias = (props) => {
  const { dadosAusencia } = props;
  useEffect(() => {
    console.log("Ausencias");
    console.log(dadosAusencia);
  }, [dadosAusencia]);

  if (dadosAusencia === null) {
    return null;
  }

  return (
    <>
      <Card>
        <Row>
          <Col span={4}>
            <Avatar
              size={100}
              style={{ cursor: "pointer" }}
              src={getProfileURL(dadosAusencia.matricula)}
            />
          </Col>
          <Col span={20} style={{ textAlign: "center" }}>
            <div className={style.nomeFunciWrapper}>
              <Paragraph>
                {`${dadosAusencia.matricula} - ${dadosAusencia.nome}`}
              </Paragraph>
              <Paragraph>
                {`${dadosAusencia.dependencia.prefixo} - ${dadosAusencia.dependencia.nome}`}
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
      <SearchTable
        columns={columns}
        dataSource={dadosAusencia.ausencias}
        size="small"
        pagination={{ showSizeChanger: true }}
      />
    </>
  );
};

export default TabelaAusencias;
