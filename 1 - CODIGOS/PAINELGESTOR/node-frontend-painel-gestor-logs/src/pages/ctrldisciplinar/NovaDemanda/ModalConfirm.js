import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col, message } from 'antd';
import { confirmarGedip } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import PageLoading from 'components/pageloading/PageLoading';

class ModalConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      funcionarioGedip: [],
      dadosGedip: [],
      funciResp: []
    }
  }

  componentDidMount = () => {
    this.props.confirmarGedip()
      .then(data => this.updateState(data))
      .catch(error => message.error("Problema ao recuperar os dados da Gedip!"))
  }

  updateState = gedip => {
    this.setState({
      funcionarioGedip: gedip.funcionarioGedip,
      dadosGedip: gedip.dadosGedip,
      funciResp: gedip.funciResp
    })
  }

  observacoes_gedip = () => {

    let observacoes_gedip;

    if (_.isNil(this.state.dadosGedip.observacoes_gedip)) {
      return null;
    } else {
      observacoes_gedip = JSON.parse(this.state.dadosGedip.observacoes_gedip);

      const observacaoNormal = (
        <React.Fragment>
          <Row>
            <Col span={12}>Descrição da Ocorrência/Participação do Funcionário:</Col><Col span={12}>{observacoes_gedip.descricao_ocorrencia && observacoes_gedip.descricao_ocorrencia}</Col>
          </Row>
          <Row>
            <Col span={12}>Normativos Descumpridos:</Col><Col span={12}>{observacoes_gedip.normativos_descumpridos && [(observacoes_gedip.normativos_descumpridos).slice(0, -1).join(', '), (observacoes_gedip.normativos_descumpridos).slice(-1)[0]].join((observacoes_gedip.normativos_descumpridos).length < 2 ? '' : ' e ')}</Col>
          </Row>
          <Row>
            <Col span={12}>Dependência do Funci à época da irregularidade:</Col><Col span={12}>{observacoes_gedip.dependencia_funci && observacoes_gedip.dependencia_funci[0] + ' ' + observacoes_gedip.dependencia_funci[1]}</Col>
          </Row>
        </React.Fragment>
      );

      const observacaoRespPec01 = (
        <React.Fragment>
          <Row>
            <Col span={12}>Versão da IN:383-1, na data do julgamento:</Col><Col span={12}>{observacoes_gedip.vers_in && observacoes_gedip.vers_in}</Col>
          </Row>
          <Row>
            <Col span={12}>Valor da Resp. Pecuniária:</Col><Col span={12}>{observacoes_gedip.valor_gedip && (observacoes_gedip.valor_gedip).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}</Col>
          </Row>
          <Row>
            <Col span={12}>Agência e Conta de débito:</Col>Agência: {observacoes_gedip.agPref && observacoes_gedip.agPref[0]} - {observacoes_gedip.agPref && observacoes_gedip.agPref[1]}<br></br>Conta-Corrente: {observacoes_gedip.cC && observacoes_gedip.cC}<Col span={12}></Col>
          </Row>
        </React.Fragment>
      );

      const observacaoRespPec02 = (
        <React.Fragment>
          <Row>
            <Col span={12}>Data da Ocorrência:</Col><Col span={12}>{observacoes_gedip.periodo && moment(observacoes_gedip.periodo).format("DD/MM/YYYY")}</Col>
          </Row>
          <Row>
            <Col span={12}>Valor da Resp. Pecuniária:</Col><Col span={12}>{observacoes_gedip.valor_prejuizo && (observacoes_gedip.valor_prejuizo).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}</Col>
          </Row>
          <Row>
            <Col span={12}>Resumo da Ocorrência:</Col><Col span={12}>{observacoes_gedip.descricao_ocorrencia && observacoes_gedip.descricao_ocorrencia}</Col>
          </Row>
          <Row>
            <Col span={12}>Normativos Descumpridos:</Col><Col span={12}>{observacoes_gedip.normativos_descumpridos && [(observacoes_gedip.normativos_descumpridos).slice(0, -1).join(', '), (observacoes_gedip.normativos_descumpridos).slice(-1)[0]].join((observacoes_gedip.normativos_descumpridos).length < 2 ? '' : ' e ')}</Col>
          </Row>
          <Row>
            <Col span={12}>Dependência do Funci à época da irregularidade:</Col><Col span={12}>{observacoes_gedip.dependencia_funci && observacoes_gedip.dependencia_funci[0] + ' ' + observacoes_gedip.dependencia_funci[1]}</Col>
          </Row>
        </React.Fragment>
      );

      if ([2, 10].includes(this.state.dadosGedip.id_medida)) {
        if ([2, 4].includes(this.state.dadosGedip.comite_gedip)) {
          return (
            <React.Fragment>
              {observacaoRespPec01}
              {observacaoRespPec02}
            </React.Fragment>
          );
        } else {
          return observacaoRespPec01;
        }
      } else {
        return observacaoNormal;
      }
    }
  }

  render = () => {

    if (!this.state.dadosGedip && !this.state.funcionarioGedip) {
      return <PageLoading />

    } else {

      return (
        <React.Fragment>
          <Row>
            <Col>
              <Row>
                <Col span={12}>Número da Gedip:</Col><Col span={12}>{this.state.dadosGedip.nm_gedip}</Col>
              </Row>
              {
                this.state.dadosGedip.id_medida === 4 &&
                <Row>
                  <Col span={12}>Dias de Suspensão:</Col><Col span={12}>{this.state.dadosGedip.qtde_dias_suspensao} dias</Col>
                </Row>
              }
              {
                this.observacoes_gedip()
              }
              <Row>
                <Col span={12}>Funcionário Envolvido:</Col><Col span={12}>{this.state.funcionarioGedip.matricula} {this.state.funcionarioGedip.nome}</Col>
              </Row>
              {
                this.state.funcionarioGedip.dependencia &&
                <Row>
                  <Col span={12}>Prefixo:</Col><Col span={12}>{this.state.funcionarioGedip.dependencia.prefixo} {this.state.funcionarioGedip.dependencia.nome}</Col>
                </Row>
              }
              <Row>
                <Col span={12}>Comitê Julgador:</Col><Col span={12}>{this.state.dadosGedip.nmComite}</Col>
              </Row>
              <Row>
                <Col span={12}>Data do Julgamento:</Col><Col span={12}>{moment(this.state.dadosGedip.dt_julgamento_gedip).format("DD/MM/YYYY")}</Col>
              </Row>
              <Row>
                <Col span={12}>Data Limite para Resposta:</Col><Col span={12}>{moment(this.state.dadosGedip.dt_limite_execucao).format("DD/MM/YYYY")}</Col>
              </Row>
              <Row>
                <Col span={12}>Decisão/Medida Definida:</Col><Col span={12}>{this.state.dadosGedip.nmMedida}</Col>
              </Row>
              <Row>
                <Col span={12}>Funcionário Responsável pelo Cumprimento:</Col><Col span={12}>{this.state.funciResp.matricula} {this.state.funciResp.nome}</Col>
              </Row>
            </Col>
          </Row>
        </React.Fragment>
      );
    }
  }
}

export default connect(null, { confirmarGedip })(ModalConfirm);

    // <p>Número da Gedip: {nm_gedip}</p>
    // <p>Funci Envolvido: {matricula} - {nome}</p>
    // <p>Comitê Julgador: {nm_comite}</p>
    // <p>Data do Julgamento: {moment(dt_julgamento_gedip).format("DD/MM/YYYY")}</p>
    // <p>Data Limite para Resposta: {moment(dt_limite_execucao).format("DD/MM/YYYY")}</p>
    // <p>Decisão/Medida Definida: {nm_medida}</p>