import React, { useState } from 'react';
import uuid from 'uuid/v4';
import {
  Button, message, Row, Col, Typography, Card, Divider, Form, Space, Drawer, Skeleton
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import { DefaultGutter, jsonToCsv } from 'utils/Commons';
import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';
import SearchTable from 'components/searchtable/SearchTable';
import PageLoading from 'components/pageloading/PageLoading';
import InputPrefixo from 'components/inputsBB/InputPrefixoDesigIntFunc';
import InputDotacao from 'components/inputsBB/InputDotacaoDesigIntFunc';
import InputFunci from 'components/inputsBB/InputFunciDesigInt';

import Movimentacao from 'pages/designacao/Pendencias/Movimentacao';
import PeriodoMovimentacao from 'pages/designacao/Consultas/PeriodoMovimentacao';
import SelectSituacao from 'pages/designacao/Consultas/SelectSituacao';
import SelectProtocolo from 'pages/designacao/Consultas/SelectProtocolo';
import SelectStatus from 'pages/designacao/Consultas/SelectStatus';
import SelectInstancia from 'pages/designacao/Consultas/SelectInstancia';
import SelectTipo from 'pages/designacao/Consultas/SelectTipo';
import TabelaDesignacao from 'pages/designacao/Commons/TabelaDesignacao';

import { fetchConsulta } from 'services/ducks/Designacao.ducks';

import 'pages/designacao/Commons/TabelaDesignacao.css';

const { Text, Title } = Typography;
function ConsultaTabela() {
  const [key, setKey] = useState(uuid());

  const [consultas, setConsultas] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [movimentacao, setMovimentacao] = useState();

  const [consultasDisabled, setConsultasDisabled] = useState(false);
  const [protocoloDisabled, setProtocoloDisabled] = useState(false);

  const [prefixo, setPrefixo] = useState();
  const [funcao, setFuncao] = useState();
  const [funci, setFunci] = useState();
  const [periodo, setPeriodo] = useState();
  const [dataSolicitacao, setDataSolicitacao] = useState();
  const [status, setStatus] = useState();
  const [situacao, setSituacao] = useState();
  const [tipo, setTipo] = useState();
  const [protocolo, setProtocolo] = useState();
  const [instancia, setInstancia] = useState();
  const [formKey, setFormKey] = useState(null);

  const [consultarButton, setConsultarButton] = useState(true);
  /* Fim States Consulta */

  const executarConsulta = () => {
    setLoading(true);
    const dados = {
      prefixo,
      funcao,
      funci,
      tipo,
      status,
      situacao,
      periodo,
      dataSolicitacao,
      protocolo,
      instancia,
      tipoConsulta: protocoloDisabled ? 1 : 2
    };

    // setData(dados);

    fetchConsulta(dados)
      .then((thisConsultas) => {
        setConsultas(thisConsultas);
        resetarCampos();
      })
      .catch((error) => message.error(error))
      .then(() => setLoading(false));
  };

  const exportConsulta = () => {
    if (!consultas.length) return message.error('Sem itens para exportar!');

    const itens = consultas.map((consulta) => ([
      {
        key: 'protocolo',
        header: 'Protocolo',
        content: consulta.protocolo,
      },
      {
        key: 'tipo',
        header: 'Tipo Movimentação',
        content: consulta.nomeTipo,
      },
      {
        key: 'prefixo_origem',
        header: 'Prefixo Origem',
        content: consulta.prefixoOrigem,
      },
      {
        key: 'nome_prefixo_origem',
        header: 'Nome Prefixo Origem',
        content: consulta.nomePrefixoOrigem,
      },
      {
        key: 'prefixo_destino',
        header: 'Prefixo Destino',
        content: consulta.prefixoDestino,
      },
      {
        key: 'nome_prefixo_destino',
        header: 'Nome Prefixo Destino',
        content: consulta.nomePrefixoDestino,
      },
      {
        key: 'limitrofes',
        header: 'Limítrofes',
        content: consulta.limitrofes,
      },
      {
        key: 'funcao_destino',
        header: 'Função Destino',
        content: consulta.tipo === 2 ? consulta.codFuncaoOrigem : consulta.codFuncaoDestino,
      },
      {
        key: 'nome_funcao_destino',
        header: 'Nome Função Destino',
        content: consulta.tipo === 2 ? consulta.nomeFuncaoOrigem : consulta.nomeFuncaoDestino,
      },
      {
        key: 'matricula_origem',
        header: 'Funcionário Indicado',
        content: consulta.chaveFunciIndicado,
      },
      {
        key: 'funci_origem',
        header: 'Nome Funcionário Indicado',
        content: consulta.nomeFunciIndicado,
      },
      {
        key: 'matricula_solicitacao',
        header: 'Funcionário Solicitante',
        content: consulta.funciSolicitacao,
      },
      {
        key: 'funci_solicitacao',
        header: 'Nome Funcionário Solicitante',
        content: consulta.nomeFunciSolicitacao,
      },
      {
        key: 'requisitos',
        header: 'Requisitos Cumpridos',
        content: consulta.requisitos,
      },
      {
        key: 'status',
        header: 'Status',
        content: consulta.textoStatus,
      },
      {
        key: 'situacao',
        header: 'Situação',
        content: consulta.textoSituacao,
      },
      {
        key: 'responsavel',
        header: 'Responsável',
        content: consulta.responsavel,
      },
      {
        key: 'nome_responsavel',
        header: 'Nome Responsável',
        content: consulta.nomeResponsavel,
      },
      {
        key: 'dt_solicitacao',
        header: 'Data Solicitação',
        content: consulta.dataRegistro,
      },
      {
        key: 'dt_ini',
        header: 'Data Início',
        content: consulta.dataInicioMovimentacao,
      },
      {
        key: 'dt_fim',
        header: 'Data Fim',
        content: consulta.dataFimMovimentacao,
      }
    ]));

    const rows = itens.map((item) => item.map((it) => it.content));
    const [titles] = itens.map((item) => item.map((it) => it.header));

    return jsonToCsv(titles, rows);
  };

  const resetarCampos = () => {
    setPrefixo(null);
    setFuncao(null);
    setFunci(null);
    setPeriodo(null);
    setDataSolicitacao(null);
    setSituacao(null);
    setStatus(null);
    setProtocolo(null);
    setConsultasDisabled(false);
    setTipo(null);
    setProtocoloDisabled(false);
    setInstancia(null);
    setConsultarButton(true);

    setKey(uuid());
    setFormKey(uuid());
  };

  const renderTabelaRegistro = () => (
    <SearchTable
      columns={TabelaDesignacao({
        comp: 'consultas',
        metodos: {
          visualizarSolicitacao
        }
      })}
      locale={{
        emptyText: loading && (
          <>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </>
        )
      }}
      dataSource={consultas}
      size="small"
      loading={
        loading ? { spinning: loading, indicator: <PageLoading customClass="flexbox-row" /> } : false
      }
    />
  );

  const conteudoModal = () => (
    <Movimentacao movimentacao={movimentacao} consulta parecer={false} key={1} />);

  const visualizarSolicitacao = (thisMovimentacao) => {
    setMovimentacao(thisMovimentacao);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const modal = () => (
    <Drawer
      height="95%"
      visible={modalVisible}
      title={<Title level={3}>Visualizar Solicitação de Movimentação</Title>}
      bodyStyle={{ maxHeight: '100%', overflow: 'scroll' }}
      placement="bottom"
      destroyOnClose
      maskClosable
      closable={false}
      onClose={closeModal}
      footer={[
        <Row key={moment()}>
          <Col align="center">
            <Button key={1} type="primary" size="large" onClick={closeModal}>
              FECHAR
            </Button>
          </Col>
        </Row>,
      ]}
    >
      {conteudoModal()}
    </Drawer>
  );

  const onPrefixoChange = (thisPrefixo) => {
    const setThisPrefixo = (prefix) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(prefix)) {
        setPrefixo({ prefixo: '', prefixoNome: '' });
      } else {
        setPrefixo({ prefixo: prefix.value, prefixoNome: prefix.label.slice(5) });
      }
    };
    setThisPrefixo(thisPrefixo);
  };

  const onFuncaoChange = (thisFuncao) => {
    const setThisFuncao = (func) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(func)) {
        setFuncao({ funcao: '', funcaoNome: '' });
      } else {
        setFuncao({ funcao: func.value, funcaoNome: func.label[2] });
      }
    };
    setThisFuncao(thisFuncao);
  };

  const onFunciChange = (thisFunci) => {
    const setThisFunci = (funcio) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(funcio)) {
        setFunci({ funci: '', funciNome: '' });
      } else {
        setFunci({ funci: funcio.value, funciNome: funcio.label[2] });
      }
    };
    setThisFunci(thisFunci);
  };

  const onPeriodoMovimentacaoChange = (thisPeriodo) => {
    const setThisPeriodo = (period) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(period)) {
        setPeriodo({ inicio: '', fim: '' });
      } else {
        setPeriodo({ inicio: period[0], fim: period[1] });
      }
    };
    setThisPeriodo(thisPeriodo);
  };

  const onPeriodoSolicitacaoChange = (thisDataSolicitacao) => {
    const setThisDataSolicitacao = (data) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(data)) {
        setDataSolicitacao({ inicio: '', fim: '' });
      } else {
        setDataSolicitacao({ inicio: data[0], fim: data[1] });
      }
    };
    setThisDataSolicitacao(thisDataSolicitacao);
  };

  const onStatusChange = (thisStatus) => {
    const setThisStatus = (stat) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(stat)) {
        setStatus([{ status: '', statusNome: '' }]);
      } else {
        setStatus(stat.map((elem) => ({ status: elem.value, statusNome: elem.label })));
      }
    };
    setThisStatus(thisStatus);
  };

  const onSituacaoChange = (thisSituacao) => {
    const setThisSituacao = (sitcao) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(sitcao)) {
        setSituacao([{ situacao: '', situacaoNome: '' }]);
      } else {
        setSituacao(sitcao.map((elem) => ({ situacao: elem.value, situacaoNome: elem.label })));
      }
    };
    setThisSituacao(thisSituacao);
  };

  const onInstanciaChange = (thisInstancia) => {
    const setThisInstancia = (instcia) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(instcia)) {
        setInstancia([{ instancia: '', instanciaNome: '' }]);
      } else {
        setInstancia(instcia.map((elem) => ({ instancia: elem.value, instanciaNome: elem.label })));
      }
    };
    setThisInstancia(thisInstancia);
  };

  const onTipoChange = (thisTipo) => {
    const setThisTipo = (tipox) => {
      setProtocoloDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(tipox)) {
        setTipo([{ tipo: '', tipoNome: '' }]);
      } else {
        setTipo(tipox.map((elem) => ({ tipo: elem.value, tipoNome: elem.label })));
      }
    };
    setThisTipo(thisTipo);
  };

  const onProtocoloChange = (thisProtocolo) => {
    const setThisProtocolo = (prot) => {
      setConsultasDisabled(true);
      setConsultarButton(false);
      if (_.isEmpty(prot)) {
        setProtocolo({ protocolo: '' });
      } else {
        setProtocolo({ protocolo: prot.label });
      }
    };

    setThisProtocolo(thisProtocolo);
  };

  const renderHeader = () => (
    <Form
      key={formKey}
      onFinish={executarConsulta}
      layout="vertical"
    >
      <Card>
        <Row gutter={DefaultGutter}>
          <Col span={8}><Form.Item labelAlign="left" name="prefixo" label="Insira o nome ou o prefixo da dependência"><InputPrefixo key={key} onChange={onPrefixoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
          <Col span={8}>{(prefixo && prefixo.prefixo) && <Form.Item labelAlign="left" name="funcao" label="Selecione a função desejada"><InputDotacao key={key} prefixo={prefixo.prefixo} onChange={onFuncaoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item>}</Col>
          <Col span={8}><Form.Item labelAlign="left" name="funci" label="Insira o nome ou a matrícula do funcionário"><InputFunci key={key} labelInValue onChange={onFunciChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
        </Row>
        <Row gutter={DefaultGutter}>
          <Col span={8}><Form.Item labelAlign="left" name="tipo" label="Selecione o tipo de Movimentação Transitória"><SelectTipo key={key} onChange={onTipoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
          <Col span={8}><Form.Item labelAlign="left" name="status" label="Selecione o Status desejado"><SelectStatus key={key} onChange={onStatusChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
          <Col span={8}><Form.Item labelAlign="left" name="situacao" label="Selecione a situação desejada"><SelectSituacao key={key} onChange={onSituacaoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
        </Row>
        <Row gutter={DefaultGutter}>
          <Col span={8}><Form.Item labelAlign="left" name="periodo" label="Pesquisar por Período de Movimentação"><PeriodoMovimentacao key={key} onChange={onPeriodoMovimentacaoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
          <Col span={8}><Form.Item labelAlign="left" name="status" label="Selecione por Instância de Análise"><SelectInstancia key={key} onChange={onInstanciaChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
          <Col span={8}><Form.Item labelAlign="left" name="dataSolicitacao" label="Pesquisar por Data da Solicitação"><PeriodoMovimentacao key={key} onChange={onPeriodoSolicitacaoChange} style={{ width: '100%' }} disabled={consultasDisabled} /></Form.Item></Col>
        </Row>
        <Divider plain>ou</Divider>
        <Row gutter={DefaultGutter}>
          <Col span={8} />
          <Col span={8}><Form.Item labelAlign="left" name="protocolo" label=""><SelectProtocolo key={key} onChange={onProtocoloChange} style={{ width: '100%' }} disabled={protocoloDisabled} value={protocolo} /></Form.Item></Col>
          <Col span={8} />
        </Row>
        <Divider />
        <Row gutter={DefaultGutter}>
          <Col span={8} />
          <Col span={8} style={{ textAlign: 'center' }}><Button type="primary" disabled={consultarButton} onClick={executarConsulta}>Consultar</Button></Col>
          <Col span={8} style={{ textAlign: 'right' }}><Button onClick={resetarCampos}>Resetar Consulta</Button></Col>
        </Row>
      </Card>
    </Form>
  );

  const renderConsultasSelecionadas = () => (
    <Card title={<Title level={3}>Critérios selecionados:</Title>}>
      {
        tipo && (
          <Row>
            <Col>
              <Text>- Tipo(s): </Text>
              <Text keyboard>{tipo.map((tip) => tip.tipoNome).join(', ')}</Text>
            </Col>
          </Row>
        )
      }
      {
        prefixo && (
          <Row>
            <Col>
              <Text>- Prefixo: </Text>
              <Text keyboard>{`${prefixo.prefixo} ${prefixo.prefixoNome}`}</Text>
            </Col>
          </Row>
        )
      }
      {
        funcao && (
          <Row>
            <Col>
              <Text>- Função: </Text>
              <Text keyboard>{`${funcao.funcao} ${funcao.funcaoNome}`}</Text>
            </Col>
          </Row>
        )
      }
      {
        funci && (
          <Row>
            <Col>
              <Text>- Funcionário Movimentado: </Text>
              <Text keyboard>{`${funci.funci} ${funci.funciNome}`}</Text>
            </Col>
          </Row>
        )
      }
      {
        periodo && (
          <Row>
            <Col>
              <Text>- Período de Movimentação: </Text>
              <Text keyboard>{`${moment(periodo.inicio).format('DD/MM/YYYY')} a ${moment(periodo.fim).format('DD/MM/YYYY')}`}</Text>
            </Col>
          </Row>
        )
      }
      {
        dataSolicitacao && (
          <Row>
            <Col>
              <Text>- Data de Solicitação: </Text>
              <Text keyboard>{`${moment(dataSolicitacao.inicio).format('DD/MM/YYYY')} a ${moment(dataSolicitacao.fim).format('DD/MM/YYYY')}`}</Text>
            </Col>
          </Row>
        )
      }
      {
        situacao && (
          <Row>
            <Col>
              <Text>- Situação(ões) da Solicitação: </Text>
              <Text keyboard>{situacao.map((sit) => sit.situacaoNome).join(', ')}</Text>
            </Col>
          </Row>
        )
      }
      {
        status && (
          <Row>
            <Col>
              <Text>- Status da Solicitação: </Text>
              <Text keyboard>{status.map((stat) => stat.statusNome).join(', ')}</Text>
            </Col>
          </Row>
        )
      }
      {
        instancia && (
          <Row>
            <Col>
              <Text>- Instância de Análise: </Text>
              <Text keyboard>{instancia.map((inst) => inst.instanciaNome).join(', ')}</Text>
            </Col>
          </Row>
        )
      }
    </Card>
  );

  const renderButtonExportar = () => {
    if (consultas) {
      return (
        <Row>
          <Col>
            <Button type="link" onClick={exportConsulta}>Exportar para Excel</Button>
          </Col>
        </Row>
      );
    }

    return null;
  };

  return (
    <>
      <StyledCardPrimary
        title={<Title level={3}>Consulta de Solicitações de Movimentação Transitória</Title>}
      >
        {renderHeader()}
        <Space />
        {renderConsultasSelecionadas()}
        <Space />
        {renderButtonExportar()}
        {renderTabelaRegistro()}
      </StyledCardPrimary>
      {modal()}
    </>
  );
}

export default React.memo(ConsultaTabela);
