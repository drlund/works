import React from 'react';
import {
  Card, Form, Divider, Button, message
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import StyledCardPrimary from 'components/styledcard/StyledCard';
import PageLoading from 'components/pageloading/PageLoading';

import { setDocumento, setSolicitacao } from 'services/ducks/Designacao.ducks';

import Constants from '../Commons/Constants';

import ItemOpcional from './ItemOpcional';
import ItemLimitrofes from './ItemLimitrofes';
import ItemNormal from './ItemNormal';

const { NEGATIVAS } = Constants();

function ObterItens({ analise }) {
  if (analise) {
    return (
      <>
        <Form.Item label={NEGATIVAS.opcional.label}>
          <ItemOpcional />
          <Divider />
        </Form.Item>
        {
          !_.isEmpty(analise.negativas)
          && analise.negativas.map((elem) => {
            const elemento = analise.analise.filter((element) => (
              _.head(Object.keys(element)) === elem));
            if (elem === 'limitrofes') {
              return (
                <Form.Item key={elem} label={NEGATIVAS[elem].label}>
                  <ItemLimitrofes
                    analise={analise}
                    elem={_.head(elemento)[elem]}
                    tipo={elem}
                  />
                  <Divider />
                </Form.Item>
              );
            }
            return (
              <Form.Item key={elem} label={NEGATIVAS[elem].label}>
                <ItemNormal
                  analise={analise}
                  elem={_.head(elemento)[elem]}
                  tipo={elem}
                />
                <Divider />
              </Form.Item>
            );
          })
        }
      </>
    );
  }

  return <PageLoading />;
}

function FormConfirmacao({ processando, protocolo, confirmar }) {
  const [formDocumentos] = Form.useForm();

  const analise = useSelector(({ designacao }) => designacao.dadosAnalise);
  const vaga = useSelector(({ designacao }) => designacao.dadosVaga);
  const negativas = useSelector(({ designacao }) => designacao.negativas);
  const tipo = useSelector(({ designacao }) => designacao.tipo);
  const dtIni = useSelector(({ designacao }) => designacao.dt_ini);
  const dtFim = useSelector(({ designacao }) => designacao.dt_fim);
  const diasTotais = useSelector(({ designacao }) => designacao.dias_totais);
  const diasUteis = useSelector(({ designacao }) => designacao.dias_uteis);

  const cor = _.isEmpty(analise.negativas) ? '#74B4C4' : '#FB630B';

  const onFinish = (values) => {
    processando(true);

    const dados = {
      analise: analise.analise,
      destino: {
        prefixo: analise.destino.prefixo,
        cod_comissao: analise.destino.cod_comissao || null,
        optbasica: analise.destino.optbasica || null,
      },
      dias_totais: diasTotais,
      dias_uteis: diasUteis,
      dt_fim: dtFim,
      dt_ini: dtIni,
      limitrofes: {
        limitrofes: analise.limitrofes.limitrofes
      },
      negativas: analise.negativas,
      nivelGer: {
        ref_org: analise.nivelGer?.ref_org
      },
      origem: {
        prefixo: analise.origem.prefixo,
        funcao_lotacao: analise.origem.funcao_lotacao,
        matricula: analise.origem.matricula,
      },
      protocolo: protocolo || '',
      requisitos: analise.requisitos,
      tipo,
      vaga: {
        funci: vaga.funci || null,
        ausencias: vaga.ausencias || null,
      },
    };

    setSolicitacao(dados)
      .then((movimentacao) => sendFiles(values, movimentacao))
      .catch((err) => {
        message.error(err);
        confirmar(null, err);
        processando(false);
      });
  };

  const sendFiles = (values, movimentacao) => {
    if (analise.negativas.length) {
      Object.entries(analise.negativas).forEach((valor, elem) => {
        if (analise.negativas[elem] === 'limitrofes') {
          const [filtro] = negativas.filter((neg) => neg.nome === analise.negativas[elem]);
          const negativa = filtro.id;

          const texto = {
            dias_uteis: diasUteis,
            dias_totais: diasTotais,
            tipoDesloc: values.tipoDesloc,
            tipo: values.tipoDesloc === 1 ? 'Hospedagem' : 'Diarias',
            hosped: values.limitrofesHosped || '',
            desloc: values.limitrofesDesloc,
            alim: values.tipoDesloc === 1 ? values.limitrofesAlim : '',
            limitrofesMotivo: values.limitrofesMotivo || '',
            limitrofesOrient: values.limitrofesOrient || '',
            limitrofesLimit: values.limitrofesLimit || '',
            limitrofesDistL: values.limitrofesDistL || '',
            limitrofesDific: values.limitrofesDific || '',
            limitrofesAusenc: values.limitrofesAusenc || '',
            limitrofesDistNL: values.limitrofesDistNL || '',
            texto: values.limitrofesText || ''
          };

          const textoFinal = textoLimitrofes(texto);

          setDocumento({
            files: values.limitrofesFiles || [],
            id_negativa: negativa,
            id: movimentacao.id,
            id_historico: 1,
            texto: textoFinal
          }).then(() => message.success('dados limítrofes enviados')).catch((error) => message.error(error));
        } else {
          const negativa = _.head(negativas.filter((neg) => (
            neg.nome === analise.negativas[elem]))).id;

          setDocumento({
            files: values[NEGATIVAS[analise.negativas[elem]].arquivos] || [],
            id_negativa: negativa,
            id: movimentacao.id,
            id_historico: 1,
            texto: (analise.negativas[elem] === 'trilhaEtica' ? `Cursos da Trilha Ética não realizados:<br>${analise.origem.treinamentos.stringCursosTrilhaEticaNaoRealizados}<br><br>Justificativa:<br>` : '') + values[`${analise.negativas[elem]}Text`]
          }).then(() => message.success(`Dados ${analise.negativas[elem]} enviados`)).catch((error) => message.error(error));
        }
      });
    }

    if (values.opcionalText || values.opcionalFiles) {
      setDocumento({
        files: values.opcionalFiles || [],
        id_negativa: 11,
        id: movimentacao.id,
        id_historico: 1,
        texto: values.opcionalText || ''
      }).then(() => message.success('Dados opcionais enviados')).catch((error) => message.error(error));
    }

    confirmar(movimentacao.protocolo);

    processando(false);
  };

  const textoLimitrofes = (texto) => {
    const getSufixoDias = (dias) => {
      if (dias > 1) {
        return ' dias';
      }
      return ' dia';
    };

    const inicio = `Não-Limítrofes: (${texto.tipo})\n`
      + `- ${texto.tipo} - `
      + `${(texto.tipoDesloc === 1)
        ? `${texto.dias_totais}${getSufixoDias(texto.dias_totais)}`
        : `${texto.dias_uteis}${getSufixoDias(texto.dias_uteis)}`}\n`;

    const deslocamento = `-- Deslocamento: ${texto.tipoDesloc === 1 ? texto.desloc.toLocaleString('PT-br', { style: 'currency', currency: 'BRL', }) : `${texto.desloc} x ${texto.dias_uteis} = ${(texto.desloc * texto.dias_uteis).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}`}, \n`;

    const alimentacao = `-- Alimentação: ${texto.alim.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })} x ${texto.tipoDesloc === 1 ? `${texto.dias_totais} (dias totais)` : `${texto.dias_uteis} (dias úteis`} = ${texto.tipoDesloc === 1
      ? (texto.alim * texto.dias_totais).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })
      : (texto.alim * texto.dias_uteis).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })} `;

    const tipoDeslocamento = `${texto.tipoDesloc === 1 ? `,\n-- Hospedagem  : ${texto.hosped.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })} x ${texto.dias_totais} = ${(texto.hosped * texto.dias_totais).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}` : '.'} \n`;

    const total = `-- Total(Valor aprox.Pode variar, conforme análise): ${((texto.tipoDesloc === 1 ? texto.desloc : texto.desloc * texto.dias_uteis) + (texto.tipoDesloc === 1 ? texto.hosped * texto.dias_totais : 0) + (texto.alim * texto.dias_totais)).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })} \n\n`;

    const textoFinal = `${inicio + deslocamento}
      ${texto.alim ? alimentacao : ''}${tipoDeslocamento}
      ${total}
      ${texto.limitrofesMotivo && ` * Qual(is) o(s) motivo(s) de não indicação de funcionário(s) da própria agência ou de agência em município limítrofe?\n-->${texto.limitrofesMotivo}\n`} `
      + `${texto.limitrofesOrient && ` * O(s) funcionário(s) da própria agência recebe(m) orientação(ões) para se capacitar(em)?\n-->${texto.limitrofesOrient}\n`} `
      + `${texto.limitrofesLimit && ` * Informar as agências LIMÍTROFES:\n-->${texto.limitrofesLimit}\n`} `
      + `${texto.limitrofesDistL && ` * Qual distância entre a(s) agência(s) LIMÍTROFE(S) e a agência DESTINO?\n-->${texto.limitrofesDistL}\n`} `
      + `${texto.limitrofesDific && ` * Há dificuldade quanto ao transporte de funcionários da(s) agência(s) LIMÍTROFE(S)?\n-->${texto.limitrofesDific}\n`} `
      + `${texto.limitrofesAusenc && ` * Há ausências de funcionários de agências LIMÍTROFES para o período de adição/designação interina?\n-->${texto.limitrofesAusenc}\n`} `
      + `${texto.limitrofesDistNL && ` * Qual a distância entre a agência NÃO LIMÍTROFE e a agência DESTINO?\n-->${texto.limitrofesDistNL}\n`} `;

    return textoFinal;
  };

  return analise && (
    <StyledCardPrimary
      title="Confirmação"
      headStyle={{
        textAlign: 'center', fontWeight: 'bold', background: `${cor} `, fontSize: '1.3rem'
      }}
      bodyStyle={{ padding: 5 }}
    >
      <Card>
        <Form
          form={formDocumentos}
          key={moment().valueOf()}
          name="documentos"
          labelAlign="left"
          onFinish={onFinish}
          layout="vertical"
        >
          <ObterItens analise={analise} />
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">Confirmar</Button>
          </Form.Item>
          {/* <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">Confirmar</Button>
            </Col>
          </Row> */}
        </Form>
      </Card>
    </StyledCardPrimary>
  );
}

export default React.memo(FormConfirmacao);
