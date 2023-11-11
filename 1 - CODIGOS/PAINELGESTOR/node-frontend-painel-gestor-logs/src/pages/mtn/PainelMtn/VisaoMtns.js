import React, { useState, useEffect, useCallback } from "react";

import {
  Col,
  Row,
  Radio,
  Spin,
  DatePicker,
  Table,
  Select,
  Tooltip,
  Form,
  message,
  Input,
} from "antd";
import StyledCard from "components/styledcard/StyledCardPrimary";
import history from "@/history.js";
import _ from "lodash";
import { filtrarOcorrenciasMtn } from "services/ducks/Mtn.ducks";
import MtnFiltros from "components/mtn/painelMtn/MtnFiltros";
import moment from "moment";
import commonColumns from "./visaoMtnColumns";
import { fetchMedidas, fetchStatus, getIdMtn, getMtnByOcorrencia } from "services/ducks/Mtn.ducks";
import RowExpand from "./RowExpand";
import ResumoVisaoMtn from "./ResumoVisaoMtn";
import { commonDateRanges, arrayMesAtual } from "utils/DateUtils";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const defaultPagination = {
  current: 1,
  pageSize: 10,
};

//Funções auxiliares

const validarFiltros = (filtros) => {
  const { envolvido, subordinacao, prefixos } = filtros;

  if (envolvido && envolvido.length !== 0 && envolvido.length !== 8) {
    return new Promise((resolve, reject) =>
      reject("Matrícula do envolvido inválida")
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
      transformados[filtro] === null ||
      transformados[filtro] === "" ||
      (Array.isArray(transformados[filtro]) &&
        transformados[filtro].length === 0)
    ) {
      delete transformados[filtro];
    }
  }

  if (!filtros.periodo_criacao_mtn) {
    transformados["periodo_criacao_mtn"] = [
      moment().startOf("month"),
      moment().endOf("month"),
    ];
  }

  if (!filtros.pendente || filtros.pendente === "SIM") {
    delete transformados["periodo_parecer"];
    transformados["pendente"] = "SIM";
  }

  if (filtros.pendente === "NAO" && !filtros.periodo_parecer) {
    throw new Error("Preencha o período do parecer");
  }

  return transformados;
};

const VisaoMtn = (props) => {
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState(null);

  const [loading, setLoading] = useState(false);
  const [medidas, setMedidas] = useState([]);
  const [status, setStatus] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [ocorrencias, setOcorrencias] = useState(null);
  const [pendentes, setPendentes] = useState("AMBOS");

  const tratarFiltros = useCallback(
    async (newPagination, filters, sorter) => {
      setLoading(true);
      try {
        await validarFiltros(filtros);
        const transformados = transformarFiltros(filtros);

        await getOcorrencias(
          transformados,
          newPagination ? newPagination : defaultPagination
        );
      } catch (error) {
        message.error(error.message ? error.message : error);
      } finally {
        setLoading(false);
      }
    },
    [filtros]
  );

  const getOcorrencias = async (filtrosValidos, pagination, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager);

    const paginationParams = {
      pageSize: pagination.pageSize,
      page: pagination.current,
    };

    const fetched = await filtrarOcorrenciasMtn(
      filtrosValidos,
      paginationParams
    );
    setPagination({
      current: fetched.currentPage,
      total: fetched.totalCount,
      pageSize: 10,
    });
    setOcorrencias({
      resumo: {
        pendentes: fetched.qtdPendentes,
        finalizados: fetched.qtdFinalizados,
        pendentesSemEnvolvidos: fetched.pendentesSemEnvolvidos,
        finalizadosSemEnvolvidos: fetched.finalizadosSemEnvolvidos,
        totalOcorrencias:
          parseInt(fetched.qtdPendentes) +
          parseInt(fetched.qtdFinalizados) +
          parseInt(fetched.pendentesSemEnvolvidos) +
          parseInt(fetched.finalizadosSemEnvolvidos),
      },
      dados: fetched.results,
    });
  };

  const irParaMtn = async (value) => {
    setLoading(true);

    try {
      if (value === "" || value === undefined) {
        throw new Error("Nùmero do MTN é inválido");
      }
      const id = await getIdMtn(value);
      history.push(`/mtn/analisar/${id}`);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const irParaMtnPelaOcorrencia = async (value) => {
    setLoading(true);
    try {
      if (value === "" || value === undefined) {
        throw new Error("Nùmero do MTN é inválido");
      }
      const id = await getMtnByOcorrencia(value);
      history.push(`/mtn/analisar/${id}`);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }


  }

  //Filtros adicionais para esta tela em específico
  const customFilters = [
    {
      name: "periodo_criacao_mtn",
      label: "Criação MTN",
      span: 12,
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
      name: "pendente",
      label: "Pendente Super",
      span: 12,
      defaultValue: "AMBOS",
      component: (
        <Radio.Group
          name="pendentes"
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            const { value } = e.target;
            form.setFieldsValue({ pendente: value });
            setPendentes(value);

            if (value === "SIM" || value === "AMBOS") {
              form.setFieldsValue({ periodo_parecer: undefined });
            }

            if (value === "SIM") {
              form.setFieldsValue({ medida: undefined });
            }
          }}
        >
          <Radio value={"AMBOS"}>Ambos</Radio>
          <Radio value={"SIM"}>Sim</Radio>
          <Radio value={"NAO"}>Não</Radio>
        </Radio.Group>
      ),
    },

    {
      name: "periodo_parecer",
      label: "Período Parecer",
      span: 18,
      component: (
        <RangePicker
          format="DD/MM/YYYY"
          disabled={pendentes === "SIM" || pendentes === "AMBOS"}
          ranges={commonDateRanges}
          allowEmpty={false}
          showToday={false}
        />
      ),
    },

    {
      name: "medida",
      label: "Medida(s)",
      span: 12,
      component: (
        <Select
          mode="multiple"
          loading={medidas.length === 0}
          placeholder="Todas"
          optionFilterProp="content"
          disabled={pendentes === "SIM"}
        >
          {medidas.map((medida) => {
            return (
              <Option value={medida.id} content={medida.txtMedida}>
                <Tooltip title={medida.txtMedida}>{medida.txtMedida}</Tooltip>
              </Option>
            );
          })}
        </Select>
      ),
    },

    {
      name: "status",
      label: "Status",
      span: 12,
      component: (
        <Select
          placeholder="Todos"
          mode="multiple"
          optionFilterProp="content"
          loading={status.length === 0}
        >
          {status.map((status) => {
            return (
              <Option content={status.descricao} value={status.id}>
                {status.descricao}
              </Option>
            );
          })}
        </Select>
      ),
    },
  ];

  //Realiza o fetch dos dados iniciais
  useEffect(() => {
    const getSelectParms = async () => {
      const fetchedMedidas = await fetchMedidas();
      setMedidas(fetchedMedidas);
      const fetchedStatus = await fetchStatus();
      setStatus(fetchedStatus);
    };

    getSelectParms();
  }, []);

  // Quando alteras os filtros, faz o fetch das ocorrencias
  useEffect(() => {
    if (filtros) {
      tratarFiltros();
    }
  }, [filtros, tratarFiltros]);

  return (
    <Spin spinning={loading}>
      <Row gutter={[20, 0]}>
        <>
          <Col>
            <Form>
              <Form.Item>
                <Search
                  placeholder="Nr. Mtn"
                  enterButton="Ir Para"
                  style={{ width: 320 }}
                  onSearch={(value) => irParaMtn(value)}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Item>
                <Search
                  placeholder="Nr. Ocorrência"
                  enterButton="Ir Para"
                  style={{ width: 320 }}
                  onSearch={(value) => irParaMtnPelaOcorrencia(value)}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <MtnFiltros
              form={form}
              updateFunc={setFiltros}
              customFilters={customFilters}
              loadingFunc={setLoading}
            />
          </Col>
          {ocorrencias !== null && (
            <>
              <Col span={24}>
                <StyledCard title="Resumo">
                  <ResumoVisaoMtn
                    resumo={
                      ocorrencias && ocorrencias.resumo
                        ? ocorrencias.resumo
                        : { pendentes: 0, finalizados: 0 }
                    }
                    total={
                      ocorrencias && ocorrencias.resumo
                        ? ocorrencias.resumo.totalOcorrencias
                        : 0
                    }
                  />
                </StyledCard>
              </Col>
              <Col span={24}>
                <StyledCard title="Registros">
                  <Table
                    columns={commonColumns}
                    dataSource={ocorrencias.dados}
                    pagination={pagination}
                    loading={loading}
                    onChange={tratarFiltros}
                    expandable={{
                      expandedRowRender: (record) => {
                        return <RowExpand record={record} />;
                      },
                    }}
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

export default VisaoMtn;
