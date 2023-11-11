import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, Col, Space, DatePicker, Input, Button, Spin, message } from 'antd';

import _ from "lodash";
import {
  fetchPainelDicoi,
  setPrazoPainelDicoi,
  setPrazoAnterioPainelDicoi,
  setPeriodoPainelDicoi,
  setPeriodoAnteriorPainelDicoi,
} from "services/ducks/Mtn.ducks";

import { commonDateRanges } from "utils/DateUtils";
import ListaPainelDicoi from "./ListaPainelDicoi";
import ResumoDicoi from "./ResumoDicoi";

import './painelDicoiCss.css';


const { RangePicker } = DatePicker;

class VisaoDicoi extends Component {
  state = {
    loading: false
  }
  getPainelData = async (periodo, prazo) => {
    if (prazo !== this.props.painelDicoiPrazoAnterior || periodo !== this.props.painelDicoiPeriodoAnterior || _.isEmpty(this.props.painelDicoiData) ) {
      this.setState({ loading: true }, async () =>{
        try {
          await this.props.fetchPainelDicoi(periodo, prazo);
          this.props.setPrazoAnterioPainelDicoi(prazo);
          this.props.setPeriodoAnteriorPainelDicoi(periodo);
        } catch (error) {
          message.error(error);
        } finally {
          this.setState({ loading: false })
        }

      })
    } else {
      message.error('Não houve alteração nos critérios de pesquisa.')
    }
  };
  
  render() {
    return (
      <>
        <Row align='middle' gutter={[10, 0]}>
          <Col flex='auto'>
            <Space>
              Período:
          <RangePicker
                name='periodo'
                format="DD/MM/YYYY"
                defaultValue={this.props.painelDicoiPeriodo}
                ranges={commonDateRanges}
                allowEmpty={false}
                showToday={false}
                onCalendarChange={value => {
                  this.props.setPeriodoPainelDicoi(value);
                }}
              />

          Prazo (dias):
          <Input
                defaultValue={this.props.painelDicoiPrazo}
                style={{ maxWidth: '35%' }}
                onChange={(e) => { this.props.setPrazoPainelDicoi(e.target.value) }}
              />
            </Space>
          </Col>
          <Col flex='auto'>
            <Button type="primary" onClick={() => { this.getPainelData(this.props.painelDicoiPeriodo, this.props.painelDicoiPrazo) }}>
              Exibir Ocorrências
        </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            {this.state.loading ?
              <Spin tip='Carregando Painel' spinning={this.state.loading} style={{ marginTop: 100 }}></Spin> :
                !_.isEmpty(this.props.painelDicoiData) && (
                <>
                  <ResumoDicoi
                    resumo={this.props.painelDicoiData.quantidades}
                  />
                  <ListaPainelDicoi
                    analises={this.props.painelDicoiData.analises}
                  />
                </>
              )}
          </Col>
        </Row>
      </>
    )
  };
}

const mapStateToProps = (state) => {
  return {
    painelDicoiData: state.mtn.painelDicoiData,
    painelDicoiPeriodo: state.mtn.painelDicoiPeriodo,
    painelDicoiPeriodoAnterior: state.mtn.painelDicoiPeriodoAnterior,
    painelDicoiPrazo: state.mtn.painelDicoiPrazo,
    painelDicoiPrazoAnterior: state.mtn.painelDicoiPrazoAnterior
  };
};

export default connect(
  mapStateToProps, {
    setPrazoPainelDicoi,
    setPrazoAnterioPainelDicoi,
    setPeriodoPainelDicoi,
    setPeriodoAnteriorPainelDicoi,
    fetchPainelDicoi
  }
)(VisaoDicoi);