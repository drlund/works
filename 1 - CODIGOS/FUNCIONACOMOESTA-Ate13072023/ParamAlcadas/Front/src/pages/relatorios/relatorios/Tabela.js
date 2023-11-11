import React from 'react';
import StyledCard from 'components/styledcard/StyledCard';
import { RedoOutlined } from '@ant-design/icons';
import { Popover, Row, Col, Button, Table, Input } from 'antd';
import _ from 'lodash';

import FunciWatermark from 'components/watermark/FunciWatermark';
// import Text from 'antd/lib/typography/Text';

const { Search } = Input;

export class Tabela extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      fetching: false,
      dados: [],
      popoverVisible: false,
      text: '',
      beginAlarm: '',
      wMOptions: ''
    }
  }

  componentDidMount() {
  }

  verificarPrefixo = () => {

  }

  detalharPrefixo = () => {

  }

  renderTabela = () => {
    const dados = Object.values(this.props.dados);
    let colunas = Object.values(this.props.colunas.columns);
    const content = (
      <div>
        <Button type="primary" ghost style={{width: 80}} onClick={() => this.detalharPrefixo()}>Jurisdição</Button>
        <br />
        <Button type="primary" ghost style={{width: 80}} onClick={() => this.verificarPrefixo()}>Detalhar</Button>
      </div>
    )

    for (let col in colunas) {
      col = parseInt(col);
      if(colunas[col].dataIndex === 'prefixo') {
        colunas[col].render = function (text, record) {
          return (
            <Popover content={content} placement="rightBottom" title={record.prefixo} trigger="click">
              <Button type="primary" width="100%">{record.prefixo}</Button>
            </Popover>
          );
        }

        colunas[col].fixed = 'left';
      }

    };
// <FunciWatermark>
//       </FunciWatermark>
    return (
      <Table
        size="small"
        columns={[...colunas]}
        dataSource={[...dados]}
        scroll={{ x: true, y: true }}
        pagination={{pageSize: 20}}
        >
      </Table>
    )
  }

  renderReloadButtons = () => {
    return (
      <Row style={{marginBottom: '15px'}}>
        <Col span={12} style={{textAlign: 'left'}}>
          <Search
            placeholder="Prefixo"
            style={{ width: 100 }}
            onSearch={value => this.get}
          >
          </Search>
        </Col>
        <Col span={12} style={{textAlign: 'right'}}>
          <Button
            icon={<RedoOutlined />}
            loading={this.state.fetching}
            style={{marginLeft: '15px'}}
            onClick={() => this.fetchAllList()}
          />
        </Col>
      </Row>
    );
  }

  render () {

    if (_.isNil(this.props.dados) || _.isNil(this.props.colunas)) {
      return null;
    }

    return (
      <div>
          <StyledCard>
            {this.renderReloadButtons()}
            <FunciWatermark>
              {this.renderTabela()}
            </FunciWatermark>
          </StyledCard>
      </div>
    )
  }
}

export default Tabela;