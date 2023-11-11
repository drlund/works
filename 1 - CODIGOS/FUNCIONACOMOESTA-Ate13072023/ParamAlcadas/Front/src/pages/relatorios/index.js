import React from 'react';
import { Container } from './relatorios/Container';
import { toggleSideBar } from 'services/actions/commons';
import { connect } from 'react-redux';

export class Relatorios extends React.Component {

  componentDidMount = () => {
    this.props.toggleSideBar(true);
  }

  render = () => {
    return (
      <Container />
    )
  }
}

export default connect(null, { toggleSideBar })(Relatorios);