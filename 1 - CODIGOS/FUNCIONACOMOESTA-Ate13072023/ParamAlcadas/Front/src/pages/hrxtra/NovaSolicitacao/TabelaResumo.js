import React from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';
// import useEffectOnce from 'utils/useEffectOnce';
import 'pages/hrxtra/NovaSolicitacao/NovaSolicitacao.css';
import PageLoading from 'components/pageloading/PageLoading';

const {Column, ColumnGroup} = Table;

function TabelaResumo(props) {
  return (
    <Card title={`Posição: ${props.dadosHE.posicao || moment().format("DD/MM/YYYY")}`} bodyStyle={{padding: '5px'}}>
      <Table
        bordered
        dataSource={props.dadosHE.visoes}
        pagination={false}
        loading={props.loading ? { spinning: props.loading, indicator: <PageLoading customClass="flexbox-row" /> } : false}
      >
        <Column className="th_tr_header" title="Visão" dataIndex="visao" key="visao" />
        <ColumnGroup className="th_tr_header" title="Hora Extra">
          <Column className="th_tr_header" title="Solicitadas" dataIndex="solicitadas" key="solicitadas" />
          <Column className="th_tr_header" title="Autorizadas" dataIndex="autorizadas" key="autorizadas" />
        </ColumnGroup>
        <ColumnGroup className="th_tr_header" title="(Rel. 310)">
          <Column className="th_tr_header" title="HE Realizada" dataIndex="realizadas" key="realizadas" />
        </ColumnGroup>
        <ColumnGroup className="th_tr_header" title="Quantidade de Horas no Banco de Horas a Vencer (Rel. 723)">
          <Column className="th_tr_header" title="Mês Atual" dataIndex="mesAtual" key="mesAtual" />
          <Column className="th_tr_header" title="Próximo Mês" dataIndex="proximoMes" key="proximoMes" />
          <Column className="th_tr_header" title="Total de Horas Acumuladas" dataIndex="horasAcumuladasTotal" key="horasAcumuladasTotal" />
        </ColumnGroup>
      </Table>
    </Card>
  )
}

export default React.memo(TabelaResumo);
