import React, { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  message,
  List,
  Avatar,
  Card,
  Tooltip,
  Typography
} from 'antd';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { DefaultGutter } from 'utils/Commons';

import InputPrefixo from 'components/inputsBB/InputPrefixoDesigIntFunc';
import InputDotacao from 'components/inputsBB/InputDotacaoDesigIntFunc';
import InputFuncis from 'components/inputsBB/InputFuncisDesigInt';

import InputOptsBasicas from 'pages/designacao/Solicitacao/InputOptsBasicas';
import Ausencias from 'pages/designacao/Solicitacao/Ausencias';
import Constants from 'pages/designacao/Commons/Constants';

import { setDadosVaga } from 'services/ducks/Designacao.ducks';
import { ausProg } from '../apiCalls/fetch';

const { TIPOS } = Constants();

const { Title } = Typography;

function FrameVaga({
  next,
  tipo,
  defaultOptions,
}) {
  const dispatch = useDispatch();

  const cadeia = useSelector(({ designacao }) => designacao.cadeia);

  const [prefixo, setPrefixo] = useState();
  const [funcao, setFuncao] = useState();
  const [funci, setFunci] = useState();
  const [motivo, setMotivo] = useState();
  const [ausencias, setAusencias] = useState([]);
  const [dotacao, setDotacao] = useState({});
  const [ausPlanejadas, setAusPlanejadas] = useState([]);
  const [defaultDotacao, setDefaultDotacao] = useState(null);

  useEffect(() => {
    onPrefixoChange();
  }, []);

  const unSetStates = (valor) => {
    if (!_.isNil(valor)) {
      const value = {
        funcao: !!valor.prefixo,
        funci: (!!valor.prefixo || !!valor.funcao),
        motivo: (!!valor.prefixo || !!valor.funcao || !!valor.funci),
      };

      if (value.funcao) {
        setFuncao();
        setDotacao({});
      }

      if (value.funci) {
        setFunci();
      }

      if (value.motivo) {
        setMotivo();
      }
    }
    setAusencias([]);
  };

  const onPrefixoChange = useCallback((pref = null) => {
    unSetStates({ prefixo: true });

    if (pref) {
      message.success('Prefixo ok!');
    }
  });

  // ao mudar a função
  const onFuncaoChange = (func, dotac) => {
    if (!_.isEmpty(dotac) && !_.isEmpty(dotac.dotacao)) {
      const [dot] = dotac.dotacao.filter((elem) => elem.codFuncao === func.key).map((elem) => {
        elem.qtdeFuncis = dotac.qtdeFuncis;
        elem.terGUN = dotac.terGUN;
        return elem;
      });
      if (dot.dotacao > dot.existencia) {
        setDefaultDotacao({ matricula: 'F0000000', nome: 'VACÂNCIA' });
      }

      setDotacao(dot);
    }

    unSetStates({ funcao: true });

    if (func) message.success('Função e Dotação ok!');
  };

  // ao mudar o funci
  const onFunciChange = async (funcio) => {
    const adjFunci = (funcion) => {
      setFunci({
        funci: funcion.value,
        funciNome: funcion.label[funcion.label.length - 1]
      });
    };

    const adjAusProg = (thisAusencias) => {
      setAusPlanejadas(thisAusencias);
    };

    if (_.isEmpty(funcio) || _.isNil(funcio) || _.isEmpty(funcio.key)) {
      setFunci();
    } else {
      adjFunci(funcio);
      adjAusProg([]);
      const ausenciasProg = await ausProg(funcio.value);
      if (ausenciasProg.length) {
        adjAusProg(ausenciasProg);
      }
    }

    unSetStates({ funci: true });

    if (funcio) {
      message.success('Funcionário ok!');
    }
  };

  // ao mudar o InputOptsBasicas
  const onMotivoChange = (motiv) => {
    unSetStates();

    if (motiv) message.success('Motivo ok!');
  };

  const changePerDesignacao = (designacao) => {
    message.success('Período de Designação atualizado!');

    const datas = {
      iniDesig: designacao.iniDesig,
      fimDesig: designacao.fimDesig,
      dt_ini: designacao.dt_ini,
      dt_fim: designacao.dt_fim,
      dias_uteis: designacao.dias_uteis,
      dias_totais: designacao.dias_totais
    };

    setAusencias(designacao.ausencias);

    const vaga = {
      prefixo: prefixo.prefixo,
      prefixoNome: prefixo.prefixoNome,
      funcao: funcao ? funcao.funcao : null,
      funcaoNome: funcao ? funcao.funcaoNome : null,
      ausencias: designacao.ausencias.map((item) => {
        const { value: codAusencia, label: tipoAusencia } = item.dados.codAusencia;
        item.dados.tipoAusencia = tipoAusencia;
        item.dados.codAusencia = codAusencia;
        return item.dados;
      }),
      diasAusencia: designacao.dias_totais,
      funci: funci.funci,
      funciNome: funci.funciNome,
      motivo,
      dotacao,
    };

    dispatch(setDadosVaga({ vaga, datas }))
      .then(() => {
        message.success('Ausências atualizadas!');
        next();
      })
      .catch(() => message.error('Ausências não atualizadas!'));
  };

  const changePerAdicao = (adicao) => {
    message.success('Período de Adição atualizado!');

    let vaga = {
      prefixo: prefixo.prefixo,
      prefixoNome: prefixo.prefixoNome,
      funcao: funcao ? funcao.funcao : null,
      funcaoNome: funcao ? funcao.funcaoNome : null,
    };

    const datas = {
      iniDesig: adicao.iniDesig,
      fimDesig: adicao.fimDesig,
      dt_ini: adicao.dt_ini,
      dt_fim: adicao.dt_fim,
      dias_uteis: adicao.dias_uteis,
      dias_totais: adicao.dias_totais
    };

    vaga = { ...vaga, ...adicao };

    dispatch(setDadosVaga({ vaga, datas }))
      .then(() => {
        message.success('Ausências atualizadas!');
        next();
      })
      .catch(() => message.error('Ausências não atualizadas!'));
  };

  const layouts = () => {
    switch (parseInt(tipo.id, 10)) {
      case TIPOS.DESIGNACAO:
        return {
          span: 8
        };
      case TIPOS.ADICAO:
        return {
          span: 12
        };
      default:
        return null;
    }
  };

  const changingValuesOnForm = (changedValues) => {
    if ('prefixo' in changedValues) {
      if (_.isEmpty(changedValues.prefixo)
        || _.isNil(changedValues.prefixo)
        || _.isEmpty(changedValues.prefixo.key)) {
        setPrefixo({ prefixo: '', prefixoNome: '' });
      } else {
        const prefSelected = JSON.parse(JSON.stringify(changedValues.prefixo));
        setPrefixo({
          prefixo: prefSelected.value,
          prefixoNome: prefSelected.label.slice(5).trim()
        });
      }
    }

    if ('funcao' in changedValues) {
      if (_.isEmpty(changedValues.funcao)
        || _.isNil(changedValues.funcao)
        || _.isEmpty(changedValues.funcao.key)) {
        setFuncao();
      } else {
        const funcSelected = JSON.parse(JSON.stringify(changedValues.funcao));
        setFuncao({
          funcao: funcSelected.value,
          funcaoNome: funcSelected.label.slice(6).trim()
        });
      }
    }

    if ('funci' in changedValues) {
      if (_.isEmpty(changedValues.funci)
        || _.isNil(changedValues.funci)
        || _.isEmpty(changedValues.funci.key)) {
        setFunci();
      } else {
        const funciSelected = JSON.parse(JSON.stringify(changedValues.funci));
        setFunci({
          funci: funciSelected.value,
          funciNome: funciSelected.label[funciSelected.label.length - 1]
        });
      }
    }

    if ('motivo' in changedValues) {
      const motivoSelected = JSON.parse(JSON.stringify(changedValues.motivo));
      setMotivo(motivoSelected);
    }
  };

  return (
    <Form
      name="FrameVaga"
      layout="vertical"
      initialValues={{
        prefixo,
        funcao,
        funci,
        ausencias,
        cadeia,
      }}
      onValuesChange={changingValuesOnForm}
      labelAlign="left"
    >
      {
        cadeia && (
          <Row>
            <Col>{`Em complemento ao protocolo ${cadeia}`}</Col>
          </Row>
        )
      }
      <Row gutter={DefaultGutter}>
        <Col span={layouts().span}>
          {
            defaultOptions && (
              <Form.Item
                label="Informe o Prefixo de Destino (Nome ou número)"
                required
                tooltip="O sistema faz a consulta por correspondência entre o texto digitado e o número ou o nome do prefixo. Após o sistema retornar os prefixos correspondentes, clique no prefixo desejado para selecioná-lo. Durante a digitação, pressionar <ENTER> cancelará a digitação, limpando o campo de pesquisa!"
                name="prefixo"
              >
                <InputPrefixo
                  onChange={onPrefixoChange}
                  defaultOptions={defaultOptions}
                />
              </Form.Item>
            )
          }
        </Col>
        <Col span={layouts().span}>
          {
            ((prefixo && prefixo.prefixo) && parseInt(tipo.id, 10) === TIPOS.DESIGNACAO) && (
              <Form.Item label="Funções acionáveis" required name="funcao">
                <InputDotacao
                  key={prefixo?.prefixo}
                  ger={parseInt(tipo.id, 10) === TIPOS.DESIGNACAO}
                  gest={parseInt(tipo.id, 10) === TIPOS.ADICAO}
                  dotacao
                  prefixo={prefixo.prefixo}
                  onChange={onFuncaoChange}
                />
              </Form.Item>
            )
          }
        </Col>
        <Col span={layouts().span}>
          {
            ((prefixo && prefixo.prefixo)
              && (funcao && funcao.funcao)
              && parseInt(tipo.id, 10) === TIPOS.DESIGNACAO)
            && (
              <Form.Item label="Funcionários Lotados" required name="funci">
                <InputFuncis
                  prefixo={prefixo.prefixo}
                  defaultOptions={defaultDotacao}
                  funcao={funcao.funcao}
                  onChange={onFunciChange}
                />
              </Form.Item>
            )
          }
        </Col>
      </Row>
      <Row gutter={DefaultGutter}>
        <Col span={24}>
          {
            ((funci && funci.funci)
              && (funcao && funcao.funcao)
              && (prefixo && prefixo.prefixo)
              && parseInt(tipo.id, 10) === TIPOS.DESIGNACAO)
            && (
              <>
                <Form.Item label="Justificativas para Solicitação de Designação Interina" required name="motivo">
                  <InputOptsBasicas
                    dadosBasicos={{ funcao: funcao.funcao, prefixo: prefixo.prefixo, dotacao }}
                    onChange={onMotivoChange} />
                </Form.Item>
                <Card>
                  <Title level={5}>
                    <Tooltip title="Ausências programadas na Plataforma de Pessoas, com situação REGISTRADO, DESPACHADO e PROCESSADO e com data final maior ou igual ao dia atual e menor que hoje + 90 dias.">
                      Ausências Programadas
                      <QuestionCircleOutlined style={{ paddingLeft: '5px' }} />
                    </Tooltip>
                  </Title>
                  <List>
                    {
                      ausPlanejadas.length
                        ? ausPlanejadas.map((item) => (
                          <List.Item key={item.MATRICULA + item.SEQ_PLANEJ}>
                            <List.Item.Meta
                              avatar={<Avatar style={{ backgroundColor: `${item.BG_COR}` }}>{item.COD_MOTIVO_AUSENCIA}</Avatar>}
                              title={`${item.MOTIVO_AUSENCIA} (${item.ESTADO_PLANEJ})`}
                              description={`Data Inicial: ${moment(item.INICIO_AUS).format('DD/MM/YYYY')} - Data Final: ${moment(item.FIM_AUS).format('DD/MM/YYYY')}`}
                            />
                          </List.Item>
                        ))
                        : null
                    }
                  </List>
                </Card>
              </>
            )
          }
        </Col>
      </Row>
      <Row gutter={DefaultGutter}>
        <Col>
          {
            ((prefixo && prefixo.prefixo)
              && (funci && funci.funci)
              && !_.isEmpty(motivo)
              && parseInt(tipo.id, 10) === TIPOS.DESIGNACAO
            ) && (
              <Form.Item name="ausencias">
                <Ausencias
                  key={motivo.id}
                  funci={funci.funci}
                  prefixo={prefixo.prefixo}
                  motivo={motivo}
                  tipo={TIPOS.DESIGNACAO}
                  onChange={changePerDesignacao}
                />
              </Form.Item>
            )
          }
          {
            ((prefixo && prefixo.prefixo) && parseInt(tipo.id, 10) === TIPOS.ADICAO) && (
              <Form.Item name="ausencias">
                <Ausencias
                  key={prefixo.prefixo}
                  prefixo={prefixo.prefixo}
                  tipo={TIPOS.ADICAO}
                  onChange={changePerAdicao}
                />
              </Form.Item>
            )
          }
        </Col>
      </Row>
    </Form>
  );
}

export default React.memo(FrameVaga);
