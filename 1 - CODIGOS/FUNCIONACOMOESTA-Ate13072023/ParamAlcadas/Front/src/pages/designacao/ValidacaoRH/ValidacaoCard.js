import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import InputDotacaoDesigInt from 'components/inputsBB/InputDotacaoDesigIntFunc';
import InputFunci from 'components/inputsBB/InputFunciDesigInt';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import useSetState from 'hooks/useSetState';
import QuadroDep from 'pages/hrxtra/NovaSolicitacao/QuadroDep';
import { analisarOrigDest, getDestino, getOrigem } from 'services/ducks/Designacao.ducks';
import { Destino, Origem, Resultado } from '../Solicitacao/ValidarFunciComp';

function ValidacaoCard({ key }) {
  const [prefixo, setPrefixo] = useSetState({ prefixo: null, nomePrefixo: null });
  const [funcao, setFuncao] = useSetState({ funcao: null, nomeFuncao: null });
  const [funci, setFunci] = useSetState({ funci: null, nomeFunci: null });
  const [dadosOrigem, setDadosOrigem] = useSetState(null);
  const [dadosDestino, setDadosDestino] = useSetState(null);
  const [dadosAnalise, setDadosAnalise] = useSetState(null);

  useEffect(() => {
    setPrefixo({ prefixo: null, nomePrefixo: null });
    setFuncao({ funcao: null, nomeFuncao: null });
    setFunci({ funci: null, nomeFunci: null });
    setDadosOrigem(null);
    setDadosDestino(null);
    setDadosAnalise(null);
  }, [key]);

  const getDadosOrigem = (matricula) => {
    getOrigem(matricula)
      .then(setDadosOrigem)
      .catch();
  };

  const getDadosDestino = (pref, func) => {
    getDestino({ prefixo: pref, funcao: func })
      .then(setDadosDestino)
      .catch();
  };

  const getDadosAnalise = () => {
    analisarOrigDest({ destino: dadosDestino, origem: dadosOrigem })
      .then(setDadosAnalise)
      .catch();
  };

  useEffect(() => {
    if (dadosOrigem && dadosDestino) {
      getDadosAnalise();
    }
  }, [dadosOrigem, dadosDestino]);

  const changePrefixo = (value) => {
    if (isEmpty(value)) {
      return setPrefixo({ prefixo: null, nomePrefixo: null });
    }
    const [thisPrefixo] = value;
    return setPrefixo({ prefixo: thisPrefixo.prefixo, nomePrefixo: thisPrefixo.nome });
  };

  const changeFuncao = (value) => {
    if (isEmpty(value)) {
      return setFuncao({ funcao: null, nomeFuncao: null });
    }
    const [thisFuncao, thisNomeFuncao] = [value.label.slice(0, 5), value.label.slice(6).trim()];
    getDadosDestino(prefixo.prefixo, thisFuncao);
    return setFuncao({ funcao: thisFuncao, nomeFuncao: thisNomeFuncao });
  };

  const changeFunci = (value) => {
    if (isEmpty(value)) {
      return setFuncao({ funci: null, nomeFunci: null });
    }
    const [thisFunci, thisNomeFunci] = [value.label[0], value.label[2]];
    getDadosOrigem(thisFunci);
    return setFunci({ funci: thisFunci, nomeFunci: thisNomeFunci });
  };

  return (
    <>
      <Card>
        <Row gutter={10}>
          <Col span={6} style={{ display: 'block' }}>
            Prefixo:
            <InputPrefixo
              fullValue
              onChange={changePrefixo}
              style={{ display: 'block' }}
            />
          </Col>
          <Col span={6} style={{ display: 'block' }}>
            Função:
            <InputDotacaoDesigInt
              prefixo={parseInt(prefixo?.prefixo, 10)}
              disabled={!prefixo?.prefixo}
              style={{ display: 'block' }}
              onChange={changeFuncao}
            />
          </Col>
          <Col span={6} />
          <Col span={6} style={{ display: 'block' }}>
            Funci:
            <InputFunci
              style={{ display: 'block' }}
              labelInValue
              onChange={changeFunci}
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={10}>
          <Col span={12}>
            {
              prefixo?.prefixo
                ? <QuadroDep prefixo={prefixo.prefixo} nomePrefixo={prefixo.nomePrefixo} />
                : null
            }
          </Col>
          <Col span={12}>
            {
              funcao?.funcao && dadosDestino
                ? <Destino dados={dadosDestino} />
                : null
            }
          </Col>
          <Col span={12}>
            {
              funci?.funci && dadosOrigem
                ? <Origem dados={dadosOrigem} />
                : null
            }
          </Col>
          <Col span={12}>
            {
              funcao?.funcao && funci?.funci && dadosAnalise
                ? <Resultado dados={dadosAnalise} />
                : null
            }
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default ValidacaoCard;
