import React, { useState, useEffect, useCallback } from "react";

import {
  Col,
  Row,
  Spin,
  DatePicker,
  Table,
  Form,
  message,
  Input,
  Checkbox,
} from "antd";
import StyledCard from "components/styledcard/StyledCardPrimary";
import _ from "lodash";
import { filtrarVisaoAssessor } from "services/ducks/Mtn.ducks";
import MtnFiltros from "components/mtn/painelMtn/MtnFiltros";
import visaoAssessorColumns from "./visaoAssessorColumns";
import { fetchAcoes } from "services/ducks/Mtn.ducks";

import ResumoVisaoAssessor from "./ResumoVisaoAssessor";
import { commonDateRanges, arrayMesAtual } from "utils/DateUtils";

const { RangePicker } = DatePicker;

const defaultPagination = {
  current: 1,
  pageSize: 10,
};

//Funções auxiliares

const validarFiltros = (filtros) => {
  const { envolvido, subordinacao, prefixos, assessor } = filtros;

  if (envolvido && envolvido.length !== 0 && envolvido.length !== 8) {
    return new Promise((resolve, reject) =>
      reject("Matrícula do envolvido inválida")
    );
  }
  if (assessor && assessor.length !== 0 && assessor.length !== 8) {
    return new Promise((resolve, reject) =>
      reject("Matrícula do assessor inválida")
    );
  }

  if (
    subordinacao &&
    subordinacao !== "nao_se_aplica" &&
    (!prefixos || (prefixos && prefixos.length === 0))
  ) {
    return new Promise((resolve, reject) =>
      reject(
        "Caso selecione uma subordinação, favor informar um ou mais prefixos"
      )
    );
  }

  return new Promise((resolve, reject) => {
    resolve();
  });
};

const transformarFiltros = (filtros) => {
  const transformados = _.cloneDeep(filtros);
  for (const filtro in filtros) {
    if (
      transformados[filtro] === undefined ||
      transformados[filtro] === "" ||
      (Array.isArray(transformados[filtro]) &&
        transformados[filtro].length === 0)
    ) {
      delete transformados[filtro];
    }
  }

  return transformados;
};

const VisaoAssessor = (props) => {
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(defaultPagination);
  const [acoes, setAcoes] = useState(null);
  const [acoesOcorrencias, setAcoesOcorrencias] = useState(null);

  const tratarFiltros = useCallback(async (newPagination) => {
    setLoading(true);
    try {
      await validarFiltros(filtros);
      const transformados = transformarFiltros(filtros);
      await getAcoes(
        transformados,
        newPagination ? newPagination : defaultPagination
      );
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const getAcoes = async (filtrosValidos, pagination, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager);

    const paginationParams = {
      pageSize: pagination.pageSize,
      page: pagination.current,
    };

    const fetched = await filtrarVisaoAssessor(
      filtrosValidos,
      paginationParams
    );
    setPagination({
      current: fetched.currentPage,
      total: fetched.totalCount,
      pageSize: 10,
    });
    setAcoesOcorrencias({
      resumo: fetched.resumo,
      dados: fetched.results,
    });
  };

  //Filtros adicionais para esta tela em específico
  const customFilters = [
    {
      name: "assessor",
      span: 4,
      label: "Assessor",
      placeholder: "Matrícula",
      component: <Input placeholder="Matricula" style={{ width: 150 }} />,
    },
    {
      name: "periodo_acoes",
      label: "Período das ações",
      span: 7,
      defaultValue: arrayMesAtual,
      component: (
        <RangePicker
          format="DD/MM/YYYY"
          ranges={commonDateRanges}
          allowEmpty={false}
          showToday={false}
        />
      ),
    },
    {
      name: "acoes",
      label: "Ações",
      span: 24,
      component: (
        <Checkbox.Group
          options={
            acoes
              ? acoes.map((acao) => {
                  return { label: acao.display, value: acao.id };
                })
              : []
          }
        />
      ),
    },
  ];

  //Realiza o fetch dos dados iniciais
  useEffect(() => {
    const getSelectParms = async () => {
      const fetchedAcoes = await fetchAcoes();
      setAcoes(fetchedAcoes);
    };

    getSelectParms();
  }, []);

  useEffect(() => {
    if (acoes) {
      form.setFieldsValue({ acoes: acoes.map((acao) => acao.id) });
    }
  }, [acoes, form]);

  // QUando alteras os filtros, faz o fetch das ocorrencias
  useEffect(() => {
    
    if (filtros) {
      tratarFiltros();
    }
  }, [filtros, tratarFiltros]);

  return (
    <Spin spinning={loading}>
      <Row gutter={[20, 0]}>
        <>
          <Col span={24}>
            <MtnFiltros
              form={form}
              updateFunc={setFiltros}
              customFilters={customFilters}
              loadingFunc={setLoading}
            />
          </Col>
          {acoesOcorrencias !== null && (
            <>
              <Col span={24}>
                <StyledCard title="Resumo">
                  <ResumoVisaoAssessor
                    resumo={acoesOcorrencias.resumo}
                    total={pagination.total ? pagination.total : 0}
                  />
                </StyledCard>
              </Col>
              <Col span={24}>
                <StyledCard title="Registros">
                  <Table
                    columns={visaoAssessorColumns}
                    dataSource={acoesOcorrencias.dados}
                    pagination={pagination}
                    loading={loading}
                    onChange={tratarFiltros}
                  />
                </StyledCard>
              </Col>
            </>
          )}
        </>
      </Row>
    </Spin>
  );
};

export default VisaoAssessor;
