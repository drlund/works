import React, { useState, useEffect } from 'react';
import { Col, Row, Card, message, Progress, Button, Typography } from 'antd';
import getPrefixoAvaliavel from './apiCalls/getPrefixoAvaliavel';
import registrarAvaliacao from './apiCalls/registrarAvaliacao';
import DadosAmbiente from './internalComponents/DadosAmbiente';
import ListaAmbientes from './internalComponents/ListaAmbientes';
import BBSpining from 'components/BBSpinning/BBSpinning';
import history from "@/history.js";
import styles from './Ambiencia.module.css';
import { useParams } from 'react-router-dom';
import { toggleSideBar } from 'services/actions/commons';
import { useDispatch } from 'react-redux';

const { Title } = Typography;

const BASE_URL_IMG = 'https://super.intranet.bb.com.br/superadm/';

const RegistrarAvaliacao = (props) => {
  const dispatch = useDispatch();
  const { idCampanha } = useParams();

  const [prefixoAvaliacao, setPrefixoAvaliacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState(true);

  const [indiceAmbienteAtual, setIndiceAmbienteAtual] = useState(0);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState(0);

  const dadosAmbienteAtual =
    prefixoAvaliacao &&
    prefixoAvaliacao.ambientes &&
    Array.isArray(prefixoAvaliacao.ambientes)
      ? prefixoAvaliacao.ambientes[indiceAmbienteAtual]
      : null;

  useEffect(() => {
    dispatch(toggleSideBar(true));
  }, []);

  const onChangeAmbiente = (novoIndice = null) => {
    setLoading(true);
    setAvaliacaoAtual(0);

    if (novoIndice !== null) {
      setIndiceAmbienteAtual(novoIndice);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }

    const newAmbientes = prefixoAvaliacao.ambientes.map((ambiente, index) => {
      return {
        ...ambiente,
        avaliacao:
          index === indiceAmbienteAtual ? avaliacaoAtual : ambiente.avaliacao,
      };
    });
    setPrefixoAvaliacao({ ...prefixoAvaliacao, ambientes: newAmbientes });

    const indiceProximoAmbientePendente = prefixoAvaliacao.ambientes.findIndex(
      (ambiente, index) => {
        return index !== indiceAmbienteAtual && ambiente.avaliacao === null;
      },
    );

    if (indiceProximoAmbientePendente > -1) {
      setIndiceAmbienteAtual(indiceProximoAmbientePendente);
    } else {
      setIndiceAmbienteAtual(prefixoAvaliacao.ambientes.length + 1);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onRegistrarAvaliacao = () => {
    setLoading(true);
    registrarAvaliacao(prefixoAvaliacao)
      .then(() => {
        history.push(`/ambiencia/avaliacao-finalizada/${idCampanha}`);
      })
      .catch((error) => {
        message.error(
          typeof error === 'string' ? error : 'Erro ao registrar a avaliação',
        );
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setSorting(true);
    if (prefixoAvaliacao === null) {
      getPrefixoAvaliavel(1)
        .then((fetchedPrefixoAvaliado) => {
          if (fetchedPrefixoAvaliado.idLock === null) {
            history.push(`/ambiencia/campanha-finalizada/${idCampanha}`);
            return;
          }

          const { idLock, ambientes } = fetchedPrefixoAvaliado;

          setPrefixoAvaliacao({
            idLock,
            ambientes: ambientes.map((ambiente) => {
              const { imagens, ...ambienteSemImg } = ambiente;
              return {
                ...ambienteSemImg,
                avaliacao: null,
                imagens: imagens.map((img) => {
                  return {
                    url: BASE_URL_IMG + img.url,
                    dataInclusao: img.dataInclusao,
                  };
                }),
              };
            }),
          });
        })
        .catch(() => {
          message.error('Erro ao recuperar prefixo');
        })
        .then(() => {
          setTimeout(() => {
            setSorting(false);
          }, 3000);
        });
    }
  }, []);

  const getPercent = () => {
    const qtdAmbientesAvaliaveis = prefixoAvaliacao.ambientes.length;
    const qtdAmbientesAvaliados = prefixoAvaliacao.ambientes.filter(
      (ambiente) => {
        return ambiente.avaliacao !== null && ambiente.avaliacao !== undefined;
      },
    ).length;

    return (qtdAmbientesAvaliados * 100) / qtdAmbientesAvaliaveis;
  };

  if (prefixoAvaliacao === null) {
    return null;
  }

  const percent = getPercent();

  if (sorting === true) {
    return (
      <div className={styles.sortingWrapper}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/sorting.gif`}
          alt="img autenticacao"
        />
        <Title level={4} style={{ marginTop: 45 }}>
          Aguarde, sorteando um prefixo para avaliação
        </Title>
      </div>
    );
  }

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[32, 16]}>
        <Col span={24}>
          <Row gutter={[32, 32]}>
            <ListaAmbientes
              indiceAmbienteAtual={indiceAmbienteAtual}
              onChangeAmbiente={onChangeAmbiente}
              ambientes={prefixoAvaliacao.ambientes}
            />
          </Row>
        </Col>
        {dadosAmbienteAtual && (
          <DadosAmbiente
            dadosAmbienteAtual={dadosAmbienteAtual}
            avaliacaoAtual={avaliacaoAtual}
            setAvaliacaoAtual={setAvaliacaoAtual}
            onChangeAmbiente={onChangeAmbiente}
          />
        )}

        <Col span={24} style={{ marginBottom: 50 }}>
          <Card title="Progresso">
            <Row gutter={[60, 32]} >
              <Col span={19}>
                <Progress
                  showInfo={false}
                  percent={getPercent().toFixed ? percent.toFixed(2) : percent}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  disabled={getPercent() !== 100}
                  onClick={onRegistrarAvaliacao}
                >
                  Finalizar
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default RegistrarAvaliacao;
