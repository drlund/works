import React, { Component } from "react";

class MtnQuestionarioAdm extends Component {
  state = {
    idResposta: "",
    loading: true,
    perguntas: {},
    errorMsg: "",
  };

  constructor(props) {
    super(props);
  }

  render() {
    <MtnQuestionario
      idQuestionario={this.props.match.params.id}
      admin={true}
    />;
  }
}


export default MtnQuestionarioAdm;
