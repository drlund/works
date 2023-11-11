import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';


export const VerDadosFunci = props => {

  return(
    <React.Fragment>
      <Row>
        <Col span={10} offset={2}>No. da GEDIP</Col><Col span={12}>{props.registro['nm_gedip']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Valor da Gedip</Col><Col span={12}>{props.registro['valor_gedip'] && (props.registro['valor_gedip']).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Comitê Julgador</Col><Col span={12}>{props.registro['nm_comite']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Funcionário Envolvido</Col><Col span={12}>{props.registro['funcionario_gedip']} - {props.registro['funcionario_gedip_nome']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Prefixo do Funcionário Envolvido</Col><Col span={12}>{props.registro['funcionario_gedip_prefixo']} - {props.registro['funcionario_gedip_prefixo_nome']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Funci Cadastrante</Col><Col span={12}>{props.registro['funci_inclusao_gedip']} - {props.registro['funci_inclusao_gedip_nome']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Prefixo do Funci Cadastrante</Col><Col span={12}>{props.registro['prefixo_inclusao_gedip']} - {props.registro['funci_inclusao_gedip_prefixo_nome']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Data do Cadastramento</Col><Col span={12}>{moment(props.registro['dt_inclusao_gedip']).format("DD/MM/YYYY")}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Medida/Decisão</Col><Col span={12}>{props.registro['nm_medida']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Data do Julgamento</Col><Col span={12}>{moment(props.registro['dt_julgamento_gedip']).format("DD/MM/YYYY")}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Data limite para execução</Col><Col span={12}>{moment(props.registro['dt_limite_execucao']).format("DD/MM/YYYY")}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Status da Demanda</Col><Col span={12}>{props.registro['nm_status']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Gestor do Funci está Envolvido?</Col><Col span={12}>{props.registro['gestor_envolvido'] ? 'Sim' : 'Não'}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Funcionário Responsável por acolher as assinaturas</Col><Col span={12}>{props.registro['chave_funci_resp']} - {props.registro['nome_funci_resp']}</Col>
      </Row>
      <Row>
        <Col span={10} offset={2}>Prefixo de Lotação do Funcionário Responsável</Col><Col span={12}>{props.registro['prefixo_resp']} - {props.registro['nome_prefixo_resp']}</Col>
      </Row>
    </React.Fragment>
  );

}


export default VerDadosFunci;