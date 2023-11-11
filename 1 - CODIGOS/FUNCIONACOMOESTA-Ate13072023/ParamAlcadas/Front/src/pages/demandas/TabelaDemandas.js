import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';

import "@/App.css";
import './Pesquisar.css';

class TabelaDemandas extends Component {
  

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <SearchTable
              columns={this.props.columns} 
              dataSource={this.props.listaDemandas}
              size="small"
              ignoreAutoKey
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default TabelaDemandas;
