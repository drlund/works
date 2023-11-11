import {
  Button,
  Col,
  Divider,
  Row,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { ListaOutorgados } from './ListaOutorgados';
import { MatriculaInputSearch } from './MatriculaInputSearch';
import { MatriculasTextArea } from './MatriculasTextArea';
import { handleMatriculaSearch } from './handleMatriculaSearch';

/**
 * @typedef {Object} ListasEtapaOutorgadoMassificado
 * @property {Record<Procuracoes.FetchedFunci['matricula'],Procuracoes.FetchedFunci>} outorgados salva os outorgados para uso
 * @property {string[]} listaDeMatriculas lista de matriculas que serão efetivamente repassadas
 * @property {Record<string,string[]>} fetchingMatriculas temp para evitar fetchs repetidos
 * @property {Record<string,string>} uuidMatriculas criação de UUID para cada matricula, fazendo neste momento para ser usado depois
 */

/**
 * @param {Procuracoes.CurrentStepParameters<ListasEtapaOutorgadoMassificado>} props
 */
const EtapaOutorgadoMassificado = ({
  dadosEtapa,
  subtrairStep,
  adicionarStep,
  isFirstStep,
}) => {
  const { dadosProcuracao: { tipoFluxo: { idFluxo } } } = useCadastroProcuracao();

  const [listas, setListas] = useState(/** @type {ListasEtapaOutorgadoMassificado} */({
    outorgados: {},
    fetchingMatriculas: {},
    listaDeMatriculas: [],
    uuidMatriculas: {},
  }));

  /**
   * @param {string} matricula
   */
  const handleRemove = (matricula) => {
    setListas((old) => {
      // remove apenas da lista de matriculas
      // mantem o outorgado já fetched (caso seja adicionado novamente)
      const newLista = old.listaDeMatriculas.filter((m) => m !== matricula);

      return {
        ...old,
        listaDeMatriculas: newLista,
      };
    });
  };

  useEffect(() => {
    if (dadosEtapa) {
      setListas((old) => ({
        ...old,
        outorgados: dadosEtapa.outorgados,
        listaDeMatriculas: dadosEtapa.listaDeMatriculas,
        uuidMatriculas: dadosEtapa.uuidMatriculas,
      }));
    }
  }, [dadosEtapa]);

  /**
   * @param {string|string[]} value
   * @param {Function} [cb] para quando terminar a adição
   */
  const handleOnSearch = (value, cb = () => { }) => {
    handleMatriculaSearch(setListas, idFluxo, value);
    cb();
  };

  return (
    <Row gutter={[0, 20]} style={{ justifyContent: "space-between" }}>
      <Col style={{ minWidth: '25%', maxWidth: '300px' }}>
        <Typography.Paragraph>
          Cole a lista de matrículas ou adicione um a um:
        </Typography.Paragraph>
        <MatriculasTextArea handleOnSearch={handleOnSearch} />
        <Divider />
        <MatriculaInputSearch handleOnSearch={handleOnSearch} />
      </Col>

      <Col style={{ maxWidth: "calc(95% - max(25%, 300px))" }}>
        <ListaOutorgados
          listas={listas}
          handleRemove={handleRemove}
        />
      </Col>

      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button
              type="default"
              disabled={isFirstStep === true}
              onClick={subtrairStep}
            >
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button
              type="default"
              onClick={() => {
                adicionarStep(listas);
              }}
              disabled={
                Object.keys(listas.fetchingMatriculas).length > 0
                || listas.listaDeMatriculas.every(
                  // desabilita passar de etapa se todos os outorgados tem erro
                  (m) => Boolean(/** @type {Procuracoes.FunciError} */(listas.outorgados[m]).error)
                )
              }
            >
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default EtapaOutorgadoMassificado;
