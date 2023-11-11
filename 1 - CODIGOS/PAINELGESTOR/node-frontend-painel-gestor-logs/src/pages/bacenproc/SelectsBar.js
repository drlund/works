import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Select, message } from 'antd';
import { connect } from 'react-redux';
import { getAno } from 'services/ducks/BacenProc.ducks';
import StyledCard from 'components/styledcard/StyledCard';

const { Option, OptGroup } = Select;


class SelectsBar extends React.Component {
  state = {};

  componentDidMount = () => {
    this.setState({pageLoading: true}, 
      () => {
        this.props.getAno({
          responseHandler: {
            successCallback: (lastYear) => {
              this.props.updateAno(lastYear);
              this.setState({ pageLoading: false });
            },
            errorCallback: (what) => {if (what) { message.error(what) } else { message.error("Falha ao obter a lista de anos.")} }
          }
        })
      }
    )
  }

  renderListaAnos = () => {
    return this.props.listaAnos.map(item => {
      return <Option key={item.ano} value={item.ano}>{item.ano}</Option>;
    });
  }


  render() {  
   return(
      <div>
        <StyledCard>
          <Form layout="vertical">
            <Row>
                <Col span={3}>
                  <Form.Item label={<span style={{fontWeight: 'bold'}}>Período</span>}>
                    <Select 
                      defaultValue="1°Tri" 
                      onChange={(value, option) => this.props.updatePeriodo(value, option.props.children)} 
                      style={{ width: 100 }}
                    >
                      <OptGroup label="Anual">
                        <Option value="Ano">Ano</Option>
                      </OptGroup>
                      <OptGroup label="Trimestre">
                        <Option value="1T">1°Tri</Option>
                        <Option value="2T">2°Tri</Option>
                        <Option value="3T">3°Tri</Option>
                        <Option value="4T">4°Tri</Option>
                      </OptGroup>
                      <OptGroup label="Semestre">
                        <Option value="1S">1°Sem</Option>
                        <Option value="2S">2°Sem</Option>
                      </OptGroup>
                    </Select>                
                  </Form.Item>
                </Col>
                
                <Col span={3}>
                  <Form.Item label={<span style={{fontWeight: 'bold'}}>Ano</span>}>
                    <Select 
                      loading={this.state.pageLoading} 
                      onChange={(ano) => this.props.updateAno(ano)} key={this.props.ano} defaultValue={this.props.ano}
                      style={{ width: 100 }}
                    >
                      {this.renderListaAnos()}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label={<span style={{fontWeight: 'bold'}}>Visão</span>}>
                    <Select 
                      defaultValue="diretoria" 
                      onChange={(value, option) => this.props.updateVisao(value, option.props.children)} 
                      style={{ width: 220 }}
                    >
                      <Option value="diretoria">Diretorias</Option>
                      <Option value="urvSuper">URV - Superintendências</Option>
                      <Option value="uavSuper">UAV - Superintendências</Option>
                      <Option value="urvGerev">URV - Regionais</Option>
                      <Option value="uavGerev">UAV - Regionais</Option>
                      <Option value="motBacen">Motivos Bacen (URV e UAV)</Option>
                    </Select>
                  </Form.Item>
                </Col>
            </Row>
          </Form>
        </StyledCard>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    listaAnos: state.bacenProc.listaAnos,
  }
}

export default connect(mapStateToProps, { getAno })(SelectsBar);
