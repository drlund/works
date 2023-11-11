import {
  Button,
  Col,
  Pagination,
  Row,
  Space
} from 'antd';

import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { MinutaTemplateShowData } from 'pages/procuracoes/innerComponents/MinutaTemplate';
import { changeDadosProcuracaoMassificado } from 'pages/procuracoes/innerComponents/MinutaTemplate/ReadOnly/changeDadosProcuracao';

import { ErrosDeMinuta } from './ErrosDeMinuta';
import { HighlightOutorgado } from './HighlightOutorgado';
import { useMinutaMassificado } from './useMinutaMassificado';

/**
 * @param {Procuracoes.CurrentStepParameters<
 *  Procuracoes.DadosProcuracao['dadosMinuta'],
 *  { isValid: boolean, dadosEtapa: Procuracoes.DadosProcuracao['dadosMinuta'] }>
 * } props
 */
export const EtapaMinutaMassificado = ({ dadosEtapa, subtrairStep, adicionarStep }) => {
  const { dadosProcuracao, setDadosProcuracao } = useCadastroProcuracao();

  const {
    listaDeMatriculas,
    dadosMassificado,
    isAllValid,
    currentDadosProcuracao,
    currentMatricula,
    current,
    setCurrent,
  } = useMinutaMassificado();

  return (
    <Row
      gutter={[0, 20]}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 0,
      }}
    >
      <Col span={24} style={{ width: '100%' }}>
        <HighlightOutorgado />
        <MinutaTemplateShowData
          key={currentMatricula.concat(dadosMassificado[currentMatricula]?.template)}
          cardTitle={`Minuta para: ${currentDadosProcuracao.outorgado.nome} (${currentDadosProcuracao.outorgado.matricula})`}
          templateBase={dadosEtapa.templateBase}
          dadosProcuracao={currentDadosProcuracao}
          editable
          changeDadosProcuracao={changeDadosProcuracaoMassificado(setDadosProcuracao, currentMatricula)}
        />
        <Pagination
          total={listaDeMatriculas.length}
          defaultPageSize={1}
          current={current}
          showSizeChanger={false}
          showQuickJumper
          responsive
          onChange={setCurrent}
          style={{ marginTop: '1.5em' }}
        />
        {
          !isAllValid && (
            <ErrosDeMinuta
              dadosMassificado={dadosMassificado}
              setCurrent={setCurrent}
              listaDeMatriculas={listaDeMatriculas}
            />
          )}
        {/* TODO: select com search por matricula */}
      </Col>

      <Col span={24}>
        <Space>
          {subtrairStep && (
            <Button type="default" onClick={() => subtrairStep()}>
              Anterior
            </Button>
          )}
          {adicionarStep && (
            <Button
              type="default"
              disabled={!isAllValid}
              onClick={() => {
                adicionarStep({
                  isValid: isAllValid,
                  // @ts-expect-error error por causa de usar o mesmo tipo pra normal e massificado
                  dadosEtapa: {
                    ...dadosProcuracao.dadosMinuta,
                    massificado: dadosMassificado,
                  }
                });
              }}
            >
              Próximo
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};
