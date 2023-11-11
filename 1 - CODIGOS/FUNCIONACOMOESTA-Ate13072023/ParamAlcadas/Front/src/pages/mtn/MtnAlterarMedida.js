import React, { Component } from "react";
//Redux
import { connect } from "react-redux";

import { toggleSideBar } from "services/actions/commons";
import { RedoOutlined } from "@ant-design/icons";
import { Tabs, Row, Col, Button, Spin } from "antd";
import MtnFormReverter from "../../components/mtn/MtnFormReverter";
import MtnListaPareceres from "../../components/mtn/MtnListaPareceres";
import MtnReverterPendentes from "../../components/mtn/MtnReverterPendentes";
import { fetchSolicitacoesPendentes} from "services/ducks/Mtn.ducks";
const { TabPane } = Tabs;

// === Styled Components ===

class MtnAlterarMedida extends Component {
  state = {
    loadingPesquisa: false,
    loadingPendentes: false,
  };

  loadingProps = {
    loading: this.state.fetchingSolicitar,
    loadingFunc: (recebido, callback = () => {}) => {
      this.setState({ loadingPesquisa: recebido }, callback);
    },
  };

  componentDidMount() {
    this.fetchPendentes();
  }

  fetchPendentes() {
    this.setState({ loadingPendentes: true }, () => {
      this.props.fetchSolicitacoesPendentes().finally(() => {
        this.setState({ loadingPendentes: false });
      });
    });
  }

  /** RENDER METHODS */

  render() {
    return (
      <Tabs type="card">
        <TabPane
          tab="Solicitar Reversão"
          key="solicitar_reversao"
          style={{ paddingTop: 30 }}
        >
          <Spin spinning={this.state.loadingPesquisa}>
            <Row align="middle" gutter={[0, 30]}>
              <Col span={24}>
                <MtnFormReverter {...this.loadingProps} />
              </Col>
              <Col span={24}>
                <MtnListaPareceres
                  reloadFunc={() => this.fetchPendentes()}
                  {...this.loadingProps}
                />
              </Col>
            </Row>
          </Spin>
        </TabPane>
        <TabPane tab="Pendentes " key="reversoes_pendentes">
          <Spin spinning={this.state.loadingPendentes}>
            <Row gutter={[0, 30]}>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  onClick={() => this.fetchPendentes()}
                  icon={<RedoOutlined />}
                ></Button>
              </Col>
              <Col span={24}>
                <MtnReverterPendentes
                  reloadFunc={() => this.fetchPendentes()}
                />
              </Col>
            </Row>
          </Spin>
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(null, {
  toggleSideBar,
  fetchSolicitacoesPendentes,
})(MtnAlterarMedida);
