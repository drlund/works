import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from "antd";
import _ from "lodash";
import moment from "moment";
import "moment/locale/pt-br";
import useEffectOnce from "utils/useEffectOnce";
import StyledCard from "components/styledcard/StyledCard";
import {
  getAllTiposHistoricos,
  getTemplateById,
  setTemplate,
} from "services/ducks/Designacao.ducks";

const InnerDrawer = (props) => {
  const [templateForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [template, setTemplat] = useState({});

  const [historicos, setHistoricos] = useState([]);

  const [idTipoHistorico, setIdTipoHistorico] = useState(null);
  const [curto, setCurto] = useState("");
  const [texto, setTexto] = useState("");

  useEffectOnce(() => {
    setLoading(() => true);
    getAllTiposHistoricos()
      .then((hists) => setHistoricos(() => hists))
      .then(() => {
        if (props.id) {
          getTemplateById(props.id).then((templt) => {
            setTemplat(() => _.head(templt));
          });
        }
      })
      .catch((error) => message.error(error));
    setLoading(() => false);
  });

  useEffect(() => {
    if (!_.isEmpty(template)) {
      setCurto(() => template.curto);
      setTexto(() => template.texto);
      setIdTipoHistorico(() => template.id_tipo_historico);

      const hist = historicos.find((o) => o.id === template.id_tipo_historico);
      templateForm.setFieldsValue({
        id_tipo_historico: hist.historico,
        curto: template.curto,
        texto: template.texto,
      });
    }
  }, [template, templateForm, historicos]);

  const incompleto = () => {
    if (_.isNil(props.id)) {
      if (_.isNil(idTipoHistorico) || _.isEmpty(curto) || _.isEmpty(texto)) {
        return true;
      }
    } else {
      if (!_.isEmpty(template)) {
        if (
          idTipoHistorico === template.id_tipo_historico &&
          curto === template.curto &&
          texto === template.texto
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const salvarTemplate = async () => {
    await setTemplate({
      id: props.id || null,
      id_tipo_historico: idTipoHistorico,
      curto: curto,
      texto: texto,
    });
    props.close();
  };

  const selItens = () => {
    if (historicos) {
      const result = historicos.map((hist) => {
        return <Select.Option key={hist.id}>{hist.historico}</Select.Option>;
      });

      return result;
    }

    return [];
  };

  const changeSel = (hist) => {
    setIdTipoHistorico(() => hist);
  };

  const changeCurto = (e) => {
    setCurto(e.target.value);
  };

  const changeTexto = (e) => {
    setTexto(e.target.value);
  };

  const TemplateForm = () => {
    return (
      <StyledCard
        title={<Typography.Title level={4}>Novo Template</Typography.Title>}
        extra={
          <Button
            disabled={incompleto()}
            type="primary"
            onClick={() => salvarTemplate()}
          >
            Salvar
          </Button>
        }
      >
        {!loading && (
          <>
            <Form name="templateForm" form={templateForm} labelAlign="left" layout="vertical">
              <Form.Item
                name="id_tipo_historico"
                label="Selecione o histórico correspondente"
              >
                <Select
                  onChange={changeSel}
                  placeholder="Escolha o histórico"
                  loading={loading}
                  notFoundContent={loading ? <Spin size="small" /> : null}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {selItens()}
                </Select>
              </Form.Item>
              <Form.Item name="curto" label="Título do Template">
                <Input onChange={changeCurto} />
              </Form.Item>
              <Form.Item name="texto" label="Digite o texto do Template">
                <Input.TextArea
                  maxLength={10000}
                  rows={10}
                  onChange={changeTexto}
                />
              </Form.Item>
            </Form>
            {!_.isEmpty(template) && (
              <>
                {template.matr_criacao && template.data_criacao && (
                  <>
                    <Typography.Text>Criado por </Typography.Text>
                    <Typography.Text strong>
                      {template.matr_criacao.matricula +
                        " " +
                        template.matr_criacao.nome}
                    </Typography.Text>
                    <Typography.Text>, em </Typography.Text>
                    <Typography.Text strong>
                      {moment(template.data_criacao).format(
                        "DD/MM/YYYY, [às] HH[h]mm"
                      )}
                    </Typography.Text>
                    <Typography.Text>.</Typography.Text>
                    <br />
                  </>
                )}
                {template.matr_alteracao && template.data_alteracao && (
                  <>
                    <Typography.Text>Alterado por </Typography.Text>
                    <Typography.Text strong>
                      {template.matr_alteracao.matricula +
                        " " +
                        template.matr_alteracao.nome}
                    </Typography.Text>
                    <Typography.Text>, em </Typography.Text>
                    <Typography.Text strong>
                      {moment(template.data_alteracao).format(
                        "DD/MM/YYYY, [às] HH[h]mm"
                      )}
                      <Typography.Text>.</Typography.Text>
                    </Typography.Text>
                  </>
                )}
              </>
            )}
          </>
        )}
      </StyledCard>
    );
  };

  return <>{TemplateForm()}</>;
};

export default React.memo(InnerDrawer);
