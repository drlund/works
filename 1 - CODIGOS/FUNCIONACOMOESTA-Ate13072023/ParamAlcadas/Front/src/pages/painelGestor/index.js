import React, { useEffect, useState } from 'react';
import { Card, Typography, message, Select, Button, Result } from 'antd';
import estilos from './painelGestor.module.css';
import coresBB from '../../utils/paletaCoresBB.module.css';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import Indicador from './components/Indicador';
import {
  getIndicadores,
  getSubordinadasByPrefixo,
} from 'pages/painelGestor/apiCalls/Indicadores';
import { SearchOutlined } from '@ant-design/icons';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import usePossuiAcessoPainelGestor from 'hooks/painelGestor/usePossuiAcessoPainelGestor';
import BBSpining from 'components/BBSpinning/BBSpinning';

export default function Home() {
  const [prefixoData, setPrefixoData] = useState({
    uor: null,
    prefixo: null,
    subordinada: null,
    nome: null,
    pontosPrefixo: null,
    classificacao: { br: null, diretoria: null, super: null, gerev: null },
  });
  const [demais, setDemais] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [informativos, setInformativos] = useState([]);
  const [prefixo, setPrefixo] = useState(null);
  const [subord, setSubord] = useState(null);
  const [listaSubordinadas, setListaSubordinadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioLogado = useUsuarioLogado();

  const tituloSecao = {
    display: 'inline-block',
    width: '100%',
    textAlign: 'center',
    fontSize: '2.3em',
  };

  const possuiAcessoPainelGestor = usePossuiAcessoPainelGestor();
  useEffect(() => {
    if (possuiAcessoPainelGestor) {
      carregarSubordinadas(usuarioLogado.prefixo)
        .then((lista) => {
          carregarDados(usuarioLogado.prefixo, lista[0].cd_subord_subordinada);
        })
        .catch(() => {
          setLoading(false);
          message.error('Não foi possível carregar os dados de seu prefixo.');
        });
    }
  }, [possuiAcessoPainelGestor]);

  const carregarSubordinadas = (prefixo) => {
    return getSubordinadasByPrefixo(prefixo)
      .then((lista) => {
        setListaSubordinadas(lista);
        return lista;
      })
      .catch(() => {
        message.error(
          'Não foi possível obter a lista de subordinadas deste prefixo',
        );
      });
  };

  const carregarDados = (prefixo, subord) => {
    setLoading(true);
    setPrefixo(null);
    setSubord('00');
    getIndicadores(prefixo, subord)
      .then((dadosIndicador) => {
        setPrefixoData({
          uor: dadosIndicador.uor,
          prefixo: dadosIndicador.prefixo,
          subordinada: dadosIndicador.subordinada,
          nome: dadosIndicador.nome,
          pontosPrefixo: dadosIndicador.pontosPrefixo,
          classificacao: dadosIndicador.classificacao,
        });
        const destaques = [];
        const informativos = [];
        const demais = [];
        for (const indicador of dadosIndicador.indicadores) {
          if (indicador.pesoIndicador === 0) {
            informativos.push(indicador);
          } else if (indicador.destaque === 1) {
            destaques.push(indicador);
          } else {
            demais.push(indicador);
          }
        }
        setDestaques(destaques);
        setInformativos(informativos);
        setDemais(demais);
        setPrefixo(prefixo);
      })
      .catch(() => {
        message.error(
          'Não foi possível obter os Indicadores. Tente Novamente.',
        );
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (prefixo) {
      carregarSubordinadas(prefixo);
    }
  }, [prefixo]);

  if (loading) {
    return (
      <BBSpining spinning={loading}>
        <div style={{ height: 500 }}></div>
      </BBSpining>
    );
  }

  return {
    ...(!possuiAcessoPainelGestor ? (
      <Result
        status="404"
        title={
          <>
            <Typography.Paragraph
              style={{ textAlign: 'center', width: '100%' }}
            >
              Seu Prefixo não faz parte do Piloto.
            </Typography.Paragraph>
            <Typography.Paragraph
              style={{ textAlign: 'center', width: '100%' }}
            >
              Em breve todos os prefixos terão acesso ao Painel de Gestão
              Administrativa.
            </Typography.Paragraph>
          </>
        }
      />
    ) : (
      <>
        <Card>
          <Card.Grid hoverable={false} className={estilos.prefixoPesquisa}>
            <div className={estilos.fonte2x}>
              {`${prefixoData.prefixo} - ${prefixoData.nome}`}
            </div>
            <div className={estilos.pesquisa}>
              <InputPrefixo
                style={{ height: ' 2.25em', width: '80%' }}
                placeholder="Informe o número ou nome do prefixo"
                onChange={setPrefixo}
              />
              {/* <Select
                style={{ width: '20%' }}
                placeholder="Subordinada"
                value={subord}
                onChange={(valor) => setSubord(valor)}
              >
                {listaSubordinadas.map((subord) => {
                  return (
                    <Option
                      key={subord.cd_subord_subordinada}
                      value={subord.cd_subord_subordinada}
                    >
                      {subord.cd_subord_subordinada}
                    </Option>
                  );
                })}
              </Select> */}
              <Button
                icon={<SearchOutlined />}
                disabled={ !prefixo } // || !subord }
                onClick={() => carregarDados(prefixo, subord)}
                style={{ backgroundColor: '#c6c6c6' }}
              ></Button>
            </div>
          </Card.Grid>
          <Card.Grid
            hoverable={false}
            className={`${coresBB.bbBGAzul} ${estilos.tamanhoFull}`}
          >
            <div className={estilos.pontuacaoClassificacao}>
              <span className={estilos.pontuacao}>Pontuação:</span>
              <span className={`${estilos.pontuacaoValores} ${estilos.borda}`}>
                {prefixoData.pontosPrefixo}
              </span>
              <span className={estilos.classificacao}>Classificação:</span>
              <span
                className={`${estilos.classificacaoValores} ${estilos.borda}`}
              >
                {prefixoData.classificacao.br !== 'null / null' && (
                  <span>Brasil: {prefixoData.classificacao.br}</span>
                )}
                {prefixoData.classificacao.diretoria !== 'null / null' && (
                  <span>Diretoria: {prefixoData.classificacao.diretoria}</span>
                )}
                {prefixoData.classificacao.super !== 'null / null' && (
                  <span>Super: {prefixoData.classificacao.super}</span>
                )}
                {prefixoData.classificacao.gerev !== 'null / null' && (
                  <span>Gerev: {prefixoData.classificacao.gerev}</span>
                )}
              </span>
            </div>
          </Card.Grid>
        </Card>
        <Typography.Text style={tituloSecao}>
          Indicadores Destaques
        </Typography.Text>
        <div className={estilos.indicadores}>
          {destaques.map((indicador) => {
            return (
              <Indicador key={indicador.idIndicador} indicador={indicador} />
            );
          })}
        </div>
        <Typography.Text style={{ ...tituloSecao, backgroundColor: '#e0e0e0' }}>
          Demais Indicadores
        </Typography.Text>
        <div className={estilos.indicadoresZebrado}>
          {demais.map((indicador) => {
            return (
              <Indicador key={indicador.idIndicador} indicador={indicador} />
            );
          })}
        </div>
        <Typography.Text style={tituloSecao}>
          Indicadores Informativos
        </Typography.Text>
        <div className={estilos.indicadores}>
          {informativos.map((indicador) => {
            return (
              <Indicador key={indicador.idIndicador} indicador={indicador} />
            );
          })}
        </div>
      </>
    )),
  };
}
