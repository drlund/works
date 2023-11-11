import React from 'react';
import StyledCard from 'components/styledcard/StyledCard';
import { Row, Col } from 'antd';
import { Select } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Option } = Select;

const rels = {
  '0997': "Acompanhamento de Administradores",
  '0998': "Acompanhamento da Gerência Média"
}

export class Cabecalho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relatorios: [...Object.keys(rels)],
      nomeRelatorio: ''
    }
  }

  componentDidMount = () => {
    return;
  }

  onFetchOptions = () => {
    return (
      this.state.relatorios.map((item) => {
        return <Option key={item} value={item}>{item}</Option>
      })
    )
  }

  nomeRelatorio = (valor) => {
    this.setState({
      nomeRelatorio: rels[valor]
    })
  }

  onChange = (value) => {
    this.nomeRelatorio(value);
    this.props.mudarRelatorio(value);
  }

  render() {
    return (
      <div>
        <StyledCard>
          <Row>
            <Col span={4}>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Escolha um Relatório"
                optionFilterProp="children"
                onChange={this.onChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.onFetchOptions()}
              </Select>
            </Col>
            <Col span={14} offset={1}>
              <Title level={3}>{this.state.nomeRelatorio}</Title>
            </Col>
          </Row>
        </StyledCard>
      </div>
    )
  }
}

export default Cabecalho;