import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Row, Col, Input, Button } from 'antd';
import history from "@/history.js";

class PrefixoInfo extends Component {
  render() {

    return (
      <Row style={{ marginTop: 15, flexFlow: 'row', justifyContent: 'center' }} gutter={[16, 32]}>
        <Col flex='0 1 auto'>
          <Input addonBefore='Prefixo' value={this.props.session.prefixo} />
        </Col>
        <Col flex='0 1 auto'>
          <Input addonBefore='Nome' value={this.props.session.dependencia} />
        </Col>
        {this.props.btn &&
          <Col flex='0 1 auto' style={{ justifyItems: 'center', paddingLeft: 4 }}>
            <Button type="primary" onClick={() => history.push('/encantar/adm/estoque')}>
              Voltar para Estoque
            </Button>
          </Col>
        }
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return { session: state.app.authState.sessionData }
}

export default connect(mapStateToProps)(PrefixoInfo);
