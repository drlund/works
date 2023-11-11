import React from 'react';
import {
  Button,
  Dropdown,
  Menu, Tooltip,
  Typography
} from 'antd';
import {
  DownOutlined,
  FlagOutlined,
  LinkOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';

import 'moment/locale/pt-br';

import Constants from 'pages/designacao/Commons/Constants';

const { DE_ACORDO_PENDENTE } = Constants().SITUACOES;
const { ADICAO } = Constants().TIPOS;

const { Text } = Typography;

function TabelaDesignacao(props) {
  return [
    {
      title: 'Protocolo',
      dataIndex: 'protocoloStr',
      width: '12%',
      key: 'protocolo',
      sorter: (a, b) => parseInt(a.protocolo.replace(/\D/g, ''), 10) - parseInt(b.protocolo.replace(/\D/g, ''), 10),
      render: (text, record) => (
        <Tooltip
          title={(
            <span>
              {_.isEmpty(record.cadeia)
                ? record.protocolo
                : record.cadeia}
              {record.priorizado ? (
                <>
                  <br />
                  <span>Solicitação priorizada por código de Ausência</span>
                </>
              ) : ''}
            </span>
          )}
        >
          {record.priorizado ? <FlagOutlined size="small" /> : ''}
          {_.isEmpty(record.cadeia) ? '' : <LinkOutlined size="small" />}
          <Text style={{
            size: '0.9rem',
            backgroundColor: '#F9F9F9',
            padding: '1px 4px',
            border: '0.5px solid #DBDBDB'
          }}>
            {record.protocolo}
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'Tipo',
      dataIndex: 'abrevTipo',
      key: 'abrevTipo',
      render: (text, record) => (
        <Tooltip title={record.nomeTipo}>
          <Text
            style={{
              fontFamily: 'monospace',
              backgroundColor: record.corTipo,
              color: 'white',
              padding: '1px 4px'
            }}
          >
            {record.abrevTipo}
          </Text>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          Origem
          <br />
          Destino
        </>
      ),
      dataIndex: 'prefixosOrigemDestino',
      key: 'prefixosOrigemDestino',
      render: (text, record) => (
        <>
          <Tooltip title={`${record.prefixoOrigem} ${record.nomePrefixoOrigem}`}>
            <Text style={{
              size: '0.9rem',
              backgroundColor: '#F9F9F9',
              padding: '1px 4px',
              border: '0.5px solid #DBDBDB'
            }}>
              {record.prefixoOrigem}
            </Text>
          </Tooltip>
          <br />
          <Tooltip title={`${record.prefixoDestino} ${record.nomePrefixoDestino}`}>
            <Text style={{
              size: '0.9rem',
              backgroundColor: '#F9F9F9',
              padding: '1px 4px',
              border: '0.5px solid #DBDBDB'
            }}>
              {record.prefixoDestino}
            </Text>
          </Tooltip>
        </>
      )
    },
    {
      title: 'Função Origem',
      dataIndex: 'funcaoOrigem',
      key: 'funcaoOrigem',
      responsive: ['xxl'],
      render: (text, record) => (
        <Tooltip title={text}>
          <Text style={{
            size: '0.9rem',
            backgroundColor: '#F9F9F9',
            padding: '1px 4px',
            border: '0.5px solid #DBDBDB'
          }}>
            {record.codFuncaoOrigem}
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'Função Destino',
      dataIndex: 'funcaoDestino',
      key: 'funcaoDestino',
      render: (text, record) => {
        if (record.tipo === ADICAO) {
          return (
            <Tooltip title={`${record.codFuncaoOrigem} ${record.nomeFuncaoOrigem}`}>
              <Text style={{
                size: '0.9rem',
                backgroundColor: '#F9F9F9',
                padding: '1px 4px',
                border: '0.5px solid #DBDBDB'
              }}>
                {record.codFuncaoOrigem}
              </Text>
            </Tooltip>
          );
        }

        return (
          <Tooltip title={`${record.codFuncaoDestino} ${record.nomeFuncaoDestino}`}>
            <Text style={{
              size: '0.9rem',
              backgroundColor: '#F9F9F9',
              padding: '1px 4px',
              border: '0.5px solid #DBDBDB'
            }}>
              {record.codFuncaoDestino}
            </Text>
          </Tooltip>
        );
      }
    },
    {
      title: (
        <>
          Funcionário
          <br />
          Indicado
        </>
      ),
      dataIndex: 'funcionarioOrigem',
      key: 'funcionarioOrigem',
      render: (text, record) => (
        <Tooltip title={`${record.chaveFunciIndicado} ${_.isNil(record.nomeFunciIndicado) ? 'Matrícula Fora da Base' : record.nomeFunciIndicado}`}>
          <Text style={{
            size: '0.9rem',
            backgroundColor: '#F9F9F9',
            padding: '1px 4px',
            border: '0.5px solid #DBDBDB'
          }}>
            {record.chaveFunciIndicado}
          </Text>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          Requisitos
          <br />
          Limítrofes
        </>
      ),
      dataIndex: 'requisitos',
      key: 'requisitos',
      disableSearch: true,
      render: (text, record) => (
        <>
          <Tooltip title={record.textoRequisitos}>
            <Text
              style={{
                fontFamily: 'monospace',
                backgroundColor: record.corRequisitos,
                color: 'white',
                padding: '1px 4px'
              }}
            >
              {record.requisitos}
            </Text>
          </Tooltip>
          <br />
          <Tooltip title={record.textoLimitrofes}>
            <Text
              style={{
                fontFamily: 'monospace',
                backgroundColor: record.corLimitrofes,
                color: 'white',
                padding: '1px 4px'
              }}
            >
              {record.limitrofes}
            </Text>
          </Tooltip>
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      disableSearch: true,
      render: (text, record) => (
        <>
          {
            (record.responsavel && record.nomeResponsavel) && (
              <>
                <Tooltip title={`Funcionário Responsável pela Condução: ${record.responsavel} ${record.nomeResponsavel} (${record.descCargoResponsavel} em ${record.prefixoLotacaoResponsavel} ${record.descLocalizacaoResponsavel})`}>
                  <Text style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'black' }}>
                    {record.responsavel}
                  </Text>
                </Tooltip>
                <br />
              </>
            )
          }
          <Tooltip title={record.textoStatus}>
            <Text
              style={{
                fontFamily: 'monospace',
                backgroundColor: record.corStatus,
                color: 'black',
                padding: '1px 4px'
              }}
            >
              {record.nomeStatus}
            </Text>
          </Tooltip>
          <br />
          <Tooltip title={(
            <>
              {record.textoSituacao}
              <br />
              {
                record.situacao === DE_ACORDO_PENDENTE && (
                  <>
                    1o. Gestor Prefixo Origem:
                    {' '}
                    {record.situacaoOrigem}
                    <br />
                    1o. Gestor Prefixo de Destino:
                    {' '}
                    {record.situacaoDestino}
                    <br />
                    Super. ou Diret. do Prefixo de Destino:
                    {' '}
                    {record.situacaoSuperior}
                  </>
                )
              }
            </>
          )}
          >
            <Text
              style={{
                fontFamily: 'monospace',
                backgroundColor: record.corSituacao,
                color: 'black',
                padding: '1px 4px'
              }}
            >
              {record.nomeSituacao}
            </Text>
          </Tooltip>
        </>
      )
    },
    {
      title: 'Data Registro',
      dataIndex: 'dataRegistro',
      key: 'dataRegistro',
      responsive: ['xxl'],
      sorter: (a, b) => parseInt(moment(a.dataRegistro, 'DD-MM-YYYY').format('YYYYMMDD'), 10) - parseInt(moment(b.dataRegistro, 'DD-MM-YYYY').format('YYYYMMDD'), 10),
      render: (text, record) => (
        <Text
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#F9F9F9',
            color: 'black',
            padding: '1px 4px',
            border: '0.5px solid #DBDBDB'
          }}
        >
          {record.dataRegistro}
        </Text>
      )
    },
    {
      title: 'Período',
      dataIndex: 'periodo',
      key: 'periodo',
      sorter: (a, b) => parseInt(moment(a.dataInicioMovimentacao, 'DD-MM-YYYY').format('YYYYMMDD'), 10) - parseInt(moment(b.dataInicioMovimentacao, 'DD-MM-YYYY').format('YYYYMMDD'), 10),
      render: (text, record) => (
        <>
          <Text
            style={{
              fontFamily: 'monospace',
              backgroundColor: '#F9F9F9',
              color: 'black',
              padding: '1px 4px',
              border: '0.5px solid #DBDBDB'
            }}
          >
            {record.dataInicioMovimentacao}
          </Text>
          <br />
          <Text
            style={{
              fontFamily: 'monospace',
              backgroundColor: '#F9F9F9',
              color: 'black',
              padding: '1px 4px',
              border: '0.5px solid #DBDBDB'
            }}
          >
            {record.dataFimMovimentacao}
          </Text>
          <br />
          <Tooltip
            title={(
              <>
                <Text style={{ color: 'white' }}>
                  {record.qtdeDiasTotais}
                  {' '}
                  {record.qtdeDiasTotais > 1 ? 'dias totais' : 'dia total'}
                </Text>
                <br />
                <Text style={{ color: 'white' }}>
                  {record.qtdeDiasUteis}
                  {' '}
                  {record.qtdeDiasUteis > 1 ? ' dias úteis' : ' dia útil'}
                </Text>
                <br />
              </>
            )}
          >
            <Text
              style={{
                fontFamily: 'monospace',
                backgroundColor: '#F9F9F9',
                color: 'black',
                padding: '1px 4px',
                border: '0.5px solid #DBDBDB'
              }}
            >
              {record.qtdeDiasTotais}
              {' '}
              {record.qtdeDiasTotais > 1 ? 'dias' : 'dia'}
            </Text>
            <br />
          </Tooltip>
        </>
      )
    },
    {
      title: 'Ações',
      dataIndex: 'acoes',
      key: 'acoes',
      width: '2%',
      align: 'center',
      disableSearch: true,
      render: (text, record) => {
        const {
          comp,
          tab,
          metodos,
        } = props;

        const submenus = [];
        if (comp === 'pendencias') {
          if (tab.key === '1') {
            submenus.push(
              <Menu.Item key={1} title="Visualizar Dados da Solicitação" onClick={() => metodos.visualizarSolicitacao({ id: record.id, pref_orig: record.prefixoOrigem, pref_dest: record.prefixoDestino })}>
                Consultar
              </Menu.Item>
            );

            if (record.perfilDeAcordo) {
              submenus.push(
                <Menu.Item key={2} title="De Acordo" onClick={() => metodos.visualizarDeAcordo({ id: record.id })}>
                  De Acordo
                </Menu.Item>
              );
            }
          }

          if (tab.key === '2') {
            submenus.push(
              <Menu.Item key={1} title="Visualizar Dados da Solicitação" onClick={() => metodos.visualizarSolicitacao({ id: record.id, pref_orig: record.prefixoOrigem, pref_dest: record.prefixoDestino })}>
                Consultar
              </Menu.Item>
            );
          }

          if (tab.key === '3') {
            submenus.push(
              <Menu.Item key={5} title="Movimentar/Atualizar" onClick={() => metodos.visualizarMovimentacao({ id: record.id, pref_orig: record.prefixoOrigem, pref_dest: record.prefixoDestino })}>
                Atualizar
              </Menu.Item>
            );
          }

          const menu = <Menu>{submenus}</Menu>;

          return (
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" title="Ações">
              <Button size="small">
                ...
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        }

        if (comp === 'registro') {
          return (
            <div>
              {record.executado ? (
                <Button disabled>Gravado no SisBB</Button>
              ) : (
                <Button
                  block
                  onClick={() => metodos.confirmaExecucao(record)}
                  type="primary"
                >
                  Confirmar Execução
                </Button>
              )}
            </div>
          );
        }

        if (comp === 'consultas') {
          const menu = (
            <Menu>
              <Menu.Item
                key={1}
                title="Visualizar Dados da Solicitação"
                onClick={() => metodos.visualizarSolicitacao({
                  id: record.id,
                  pref_orig: record.prefixoOrigem,
                  pref_dest: record.prefixoDestino,
                  dotacoes: record.dotacoes,
                  menuConsultas: true
                })}>
                Visualizar Solicitação
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" title="Ações">
              <Button size="small">
                ...
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        }

        return null;
      }
    }
  ];
}

export default TabelaDesignacao;
