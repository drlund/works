import React, { useState } from "react";
import { Row, Col, Button, Select, message } from "antd";
import { Link } from "react-router-dom";
import SolicitacoesAndamento from "./SolicitacoesAndamento";
import { fetchStatusSolicitacoes } from 'services/ducks/Encantar.ducks';
import CommonStyles from "@/Commons.module.scss";
import useEffectOnce from 'utils/useEffectOnce';

const Option = Select.Option;

const TodasSolicitacoes = () => {
  const [statusPesquisa, setStatusPesquisa] = useState(1);
  const [statusList, setStatusList] = useState([]);
  const [fetchingStatusList, setFetchingStatusList] = useState(true);

  useEffectOnce(() => {
    fetchStatusSolicitacoes()
      .then(list => {
        setStatusList([...list, {id: 0, descricao: "Todas"}])
      })
      .catch(() => {
        message.error("Falha ao obter a lista de estados das solicitações!")
        setStatusList([]);
      })
      .then(() => {
        setFetchingStatusList(false)
      })
  })

  function onStatusChange(value) {
    setStatusPesquisa(value)
  }

  return (
    <Row style={{ marginTop: 0 }} gutter={[0, 20]}>
      <Col span={24}>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, display: 'flex', alignItems: 'end'}}>
            <Link to="/encantar/solicitacoes/incluir">
              <Button type="primary">Incluir Solicitação</Button>
            </Link>
          </div>
          <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
            <div className={CommonStyles.flexColumn} style={{width: '50%'}}>
              { !fetchingStatusList && 
                <>
                  <div className={CommonStyles.headerText}>Estado da Solicitação</div>
                  <Select defaultValue={statusPesquisa} loading={fetchingStatusList} onChange={onStatusChange}>
                    {statusList.map(elem => <Option value={elem.id} key={elem.id}>{elem.descricao}</Option>)}
                  </Select> 
                </>
              }
            </div>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <SolicitacoesAndamento  fetching={fetchingStatusList} statusPesquisa={statusPesquisa} />
      </Col>
    </Row>
  );
};

export default TodasSolicitacoes;
