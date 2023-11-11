import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchDotacao } from 'services/ducks/Designacao.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { message, Table, Typography } from 'antd';
import _ from 'lodash';

const { Text } = Typography;

class QuadroDependencia extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dotacao: {}
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.atividade();
    }
  }

  componentDidUpdate(prevProps) {
    const { prefixo } = this.props;
    if (prefixo !== prevProps.prefixo && this._isMounted) this.atividade();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  atividade = () => {
    if (this.props.dotacao) {
      const dotTotal = this.compTotal(this.props.dotacao);
      if (this._isMounted) {
        this.setState({ dotacao: dotTotal.dotacao });
      }
    } else if (this._isMounted) {
      this.setState({ loading: true }, () => {
        this.props.fetchDotacao(this.props.prefixo, false, false)
          .then((dotacao) => {
            const dotTotal = !_.isEmpty(dotacao) ? this.compTotal(dotacao) : { dotacao: 0 };
            if (this._isMounted) {
              this.setState({ dotacao: dotTotal.dotacao });
            }
          })
          .catch((error) => message.error(error))
          .then(() => this._isMounted && this.setState({ loading: false }));
      });
    }
  };

  compTotal = (dot) => {
    if (dot) {
      let result = {};

      const { prefixo } = dot.dotacao[0];

      dot.dotacao.forEach((basket) => {
        for (const [key, value] of Object.entries(basket)) {
          if (['dotacao', 'existencia', 'lotacao'].includes(key)) {
            if (result[key]) {
              result[key] += value;
            } else {
              result[key] = value;
            }
          }
          if (['vagas', 'vacancia'].includes(key)) {
            value > 0
              ? (result[key] = (result[key] || 0) + value)
              : (result[key] = (result[key] || 0) + 0);
          }
        }
      });

      result = {
        codFuncao: '-',
        key: '00000',
        nmFuncao: 'TOTAL',
        prefixo,
        ...result,
      };

      dot.dotacao.push(result);
    }

    return dot;
  };

  colunas = () => [
    {
      title: 'Código',
      dataIndex: 'codFuncao',
      key: 'codFuncao',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.codFuncao}</Text>
    },
    {
      title: 'Função',
      dataIndex: 'nmFuncao',
      key: 'nmFuncao',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.nmFuncao}</Text>
    },
    {
      title: 'Dotação',
      dataIndex: 'dotacao',
      key: 'dotacao',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.dotacao}</Text>
    },
    {
      title: 'Lotação',
      dataIndex: 'lotacao',
      key: 'lotacao',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.lotacao}</Text>
    },
    {
      title: 'Existência',
      dataIndex: 'existencia',
      key: 'existencia',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.existencia}</Text>
    },
    {
      title: 'Vagas',
      dataIndex: 'vagas',
      key: 'vagas',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.vagas}</Text>
    },
    {
      title: 'Vacância',
      dataIndex: 'vacancia',
      key: 'vacancia',
      render: (text, record) => <Text style={{ fontSize: '0.7rem' }}>{record.vacancia}</Text>
    },
  ];

  renderQuadro = () => {
    const { loading } = this.state;
    return (
      <Table
        style={{ fontSize: '0.7rem' }}
        columns={this.colunas()}
        dataSource={this.state.dotacao}
        pagination={false}
        size="small"
        loading={loading ? { spinning: loading, indicator: <PageLoading /> } : false}
      />
    );
  };

  render() {
    const { dotacao } = this.state;
    if (_.isEmpty(dotacao)) {
      return null;
    }

    return (
      <>
        {this.renderQuadro()}
      </>
    );
  }
}

export default connect(null, { fetchDotacao })(QuadroDependencia);
