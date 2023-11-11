import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Spin } from 'antd';
import StyledCard from 'components/styledcard/StyledCardPrimary';
import { fetchQuestionarioInfo } from "services/ducks/Mtn.ducks";

const columns = [
  {
    title: 'Pergunta',
    dataIndex: 'pergunta'
  },
  {
    title: 'Resposta',
    dataIndex: 'resposta'
  }
];
class QuestionarioInfo extends Component {
  state = {
    loading: true
  }
  componentDidMount(){
    this.props.fetchQuestionarioInfo(this.props.match.params.idEnvolvido, this.props.match.params.idMtn)
    this.setState({loading: false});
  }

  render(props) {
    if(this.state.loading){
      return(
        <Spin tip='Carregando ...' spinning={this.state.loading} style={{ marginTop: 100 }}></Spin>
      )
    } else {
      return (
        <StyledCard title="Questionario">
          <Table 
            columns={columns}
            dataSource={this.props.questionarioView}
            scroll={{ x: 'auto' }}
          />
        </StyledCard>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    questionarioView: state.mtn.questionarioView,
  };
};

export default connect(mapStateToProps, {
  fetchQuestionarioInfo,
})(QuestionarioInfo);