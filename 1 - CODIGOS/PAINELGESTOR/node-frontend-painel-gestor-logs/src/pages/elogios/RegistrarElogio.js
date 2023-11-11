import React, {Component} from 'react';
import { novoElogio } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import ElogioForm from './ElogioForm';
import PageLoading from 'components/pageloading/PageLoading';


class RegistrarElogio extends Component{
  state = {       
    loading: true
  };

  componentDidMount() {
    this.props.novoElogio(this.onClearData);
  }

  onClearData = () => {
    this.setState({loading: false});
  }

  render() {
    if(this.state.loading){
      return( <PageLoading /> );
    }else{
      return (
          <ElogioForm />
      )
    }
  }
}

export default connect(null, { novoElogio })(RegistrarElogio);