/* eslint-disable */

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Input,
  Checkbox,
  Radio,
  DatePicker,
  Select,
  Upload,
  message,
  Modal,
  Alert,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import InputPrefixo from "../../components/inputsBB/InputPrefixo";
import InputFunci from "../../components/inputsBB/InputFunci";
import InputFuncisMultiplos from "../../components/inputsBB/InputFuncisMultiplos";
import InputContaCorrente from "../../components/inputsBB/InputContaCorrente";
import {
  InputMoeda,
  InputInteger,
  InputCNPJ,
  InputNumberCustomMask,
} from "../../components/numberformat/NumberFormat";
import moment from "moment";
import "moment/locale/pt-br";
import {
  types,
  checkDtEventoForaPrazo,
  getArquivo,
  tipoCampoResposta,
} from "services/ducks/Patrocinios.ducks";

const { Option } = Select;

const itensStyle = {
  height: "30px",
  lineHeight: "30px",
  maxWidth: "780px",
};

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export class FormText extends React.Component {
  render() {
    return <Input {...this.props} />;
  }
}

export class FormTextArea extends React.Component {
  render() {
    return <Input.TextArea {...this.props} />;
  }
}

export const FormUpload = (props) => {
  const { idTipoArquivo, idsolicitacao } = props;

  const arquivos = useSelector(({ patrocinios }) => {
    const { arquivos } = patrocinios;
    return arquivos[idTipoArquivo] ? arquivos[idTipoArquivo] : [];
  });

  const dispatch = useDispatch();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewType, setPreviewType] = useState("");

  const validateFile = (file) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "application/pdf";

    if (!isImage) {
      message.error(
        "Permitido apenas upload de arquivos de imagens (jpg/png) ou pdf!"
      );
    }

    return isImage;
  };

  const handleChange = (info) => {
    const fileList = [...info.fileList];

    if (fileList.length && validateFile(info.file)) {
      fileList.forEach(async (file) => {
        file.status = "done"; // Altera o status do upload do arquivo para concluído
        file.url = await getBase64(file.originFileObj); // Gera base64 para preview
      });
    }

    // Atualiza a lista de arquivos no redux
    dispatch({
      type: types.PATROCINIOS_CHANGE_FILE_LIST,
      payload: fileList,
      idTipoArquivo,
    });
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if ((!file.url && !file.preview) || file.url === "0") {
      if (file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      } else {
        await getArquivo({
          idSolicitacao: idsolicitacao,
          idTipoArquivo,
          readOnly: props.disabled,
          responseHandler: {
            successCallback: (arquivo) => {
              if (arquivo && arquivo[idTipoArquivo]) {
                dispatch({
                  type: types.PATROCINIOS_CHANGE_FILE_LIST,
                  payload: arquivo[idTipoArquivo],
                  idTipoArquivo,
                });

                file.url = arquivo[idTipoArquivo][0].url;
              }
            },
            errorCallback: () => message.error("Erro ao buscar arquivo."),
          },
        });
      }
    }

    setPreviewType(file.type);
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload (Opcional)</div>
    </div>
  );

  const renderImage = () => {
    return previewType === "application/pdf" ? (
      <embed src={previewImage} width="100%" height={800} />
    ) : (
      <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
    );
  };

  const renderUploadList = () => {
    const uploadList = document.getElementsByClassName(
      "ant-upload-list-item-actions"
    ); // Elementos HTML da lista de upload

    if (uploadList && uploadList.length) {
      for (const elem of uploadList) {
        const tagA = elem.querySelector("a"); // Primeiro elemento filho HTML <a>

        if (tagA.style.length) {
          tagA.style = {}; // Retira o estilo css do elemento
        }
      }
    }
  };

  return (
    <>
      <Upload
        {...props}
        fileList={arquivos}
        accept="image/*,.pdf"
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
      >
        {arquivos.length >= 1 ? renderUploadList() : uploadButton}
      </Upload>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={previewType === "application/pdf" ? "50%" : "30%"}
        style={previewType === "application/pdf" ? { top: 10 } : {}}
      >
        {renderImage()}
      </Modal>
    </>
  );
};

export function FormUploadFile(props) {
  const { itens } = props;

  return itens.map((item) => {
    return (
      <Row key={item.id} align="middle">
        <Col flex="0 0 auto" style={{ paddingLeft: 15 }}>
          <FormUpload
            name={`file${item.idTipoArquivo}`}
            idTipoArquivo={item.idTipoArquivo}
            disabled={props.disabled}
          />
        </Col>
      </Row>
    );
  });
}

export function FormCheckbox(props) {
  const { itens, value, idsolicitacao } = props;

  const dispatch = useDispatch();
  const camposResposta = useSelector(
    ({ patrocinios }) => patrocinios.camposResposta
  );
  const camposCheckbox = useSelector(({ patrocinios }) => {
    const campos = {};

    for (const key in patrocinios.camposResposta) {
      if (key === props.id && Number(key) !== tipoCampoResposta.nrMKT) {
        campos[key] = patrocinios.camposResposta[key];
      }
    }

    return campos;
  });

  // Altera o valor do campo no redux
  const changeCampoResposta = (idTipoOpcao, resposta) => {
    if (idTipoOpcao) {
      dispatch({
        type: types.PATROCINIOS_CHANGE_CAMPOS_RESPOSTA,
        payload: resposta,
        idTipoOpcao,
      });
    }
  };

  const handleChangeCheck = (target, idTipoArquivo, idTipoOpcao) => {
    const { checked } = target;

    // Se a opção foi desmarcada, então o arquivo é removido do redux
    if (!checked) {
      dispatch({
        type: types.PATROCINIOS_CHANGE_FILE_LIST,
        payload: [],
        idTipoArquivo,
      });

      changeCampoResposta(idTipoOpcao, "");
    }
  };

  const changeSimNaoResposta = (val, id) => {
    changeCampoResposta(props.id, { ...camposCheckbox[props.id], [id]: val });
  };

  return (
    <Checkbox.Group {...props}>
      {itens.map((item) => {
        const isCheckedUpload =
          item.idTipoArquivo && value && value.includes(item.id);
        const isCheckedTipoOpcao =
          item.idTipoOpcao && value && value.includes(item.id);

        switch (item.idTipoOpcao) {
          case tipoCampoResposta.simNaoSubperguntas:
            if (item.subopcoes) {
              const campos = JSON.parse(item.subopcoes);

              if (campos) {
                return (
                  <FormSimNaoSubperguntas
                    key={item.id}
                    id={item.id}
                    descricao={item.descricao}
                    itens={campos}
                    disabled={props.disabled}
                    value={
                      camposCheckbox[props.id] &&
                      camposCheckbox[props.id][item.id]
                        ? camposCheckbox[props.id][item.id]
                        : null
                    }
                    onChange={(val) => changeSimNaoResposta(val, item.id)}
                  />
                );
              }
            }

            return null;
          default:
            return (
              <Row key={item.id} align="middle">
                <Col
                  flex="0 1 auto"
                  style={{
                    ...itensStyle,
                    height:
                      item.descricao.length < 125
                        ? 30
                        : (Math.floor(item.descricao.length / 120) + 1) * 30,
                  }}
                >
                  <Checkbox
                    value={item.id}
                    onChange={(e) =>
                      handleChangeCheck(
                        e.target,
                        item.idTipoArquivo,
                        item.idTipoOpcao
                      )
                    }
                  >
                    {item.descricao}
                  </Checkbox>
                </Col>

                {isCheckedUpload && (
                  <Col flex="0 0 auto" style={{ paddingLeft: 15 }}>
                    <FormUpload
                      name={`file${item.idTipoArquivo}`}
                      idsolicitacao={idsolicitacao}
                      idTipoArquivo={item.idTipoArquivo}
                      disabled={!isCheckedUpload || props.disabled}
                    />
                  </Col>
                )}

                {isCheckedTipoOpcao &&
                  item.idTipoOpcao === tipoCampoResposta.nrMKT && (
                    <FormInputNumberCustomMask
                      value={camposResposta[item.idTipoOpcao]}
                      placeholder="Informe nº do MKT"
                      format="####/#####"
                      disabled={props.disabled}
                      onChange={({ target }) =>
                        changeCampoResposta(item.idTipoOpcao, target.value)
                      }
                    />
                  )}
              </Row>
            );
        }
      })}
    </Checkbox.Group>
  );
}

export function FormInputNumberCustomMask(props) {
  return <InputNumberCustomMask {...props} />;
}

export function FormRadio(props) {
  const value = props.value ? Number(props.value) : undefined;

  return (
    <Radio.Group {...props} value={value}>
      {props.itens.map((item) => {
        return (
          <Radio style={itensStyle} key={item.id} value={item.id}>
            {item.descricao}
          </Radio>
        );
      })}
    </Radio.Group>
  );
}

export function FormRadioSubperguntas(props) {
  const { value, itens, pergunta } = props;

  const [valueInput, setValueInput] = useState("");
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [labelSubopcao, setLabelSubopcao] = useState("");
  const [valueSubopcao, setValueSubopcao] = useState("");
  const [idTipoOpcao, setIdTipoOpcao] = useState(0);

  const dispatch = useDispatch();

  // Altera o valor do campo no redux
  const changeCampoResposta = useCallback(
    (resposta) => {
      if (pergunta.id) {
        dispatch({
          type: types.PATROCINIOS_CHANGE_CAMPOS_RESPOSTA,
          payload: resposta,
          idTipoOpcao: pergunta.id,
        });
      }
    },
    [pergunta.id, dispatch]
  );

  const showOrHideSuboptions = useCallback(
    (val) => {
      const opcoes = itens.find((item) => val === item.id);
      if (opcoes && opcoes.idTipoOpcao && opcoes.subopcoes) {
        const subopcoes = JSON.parse(opcoes.subopcoes);

        setLabelSubopcao(
          subopcoes && subopcoes.descricao ? subopcoes.descricao : ""
        );

        setIdTipoOpcao(opcoes.idTipoOpcao);
        setShowSubOptions(true);
      } else {
        setShowSubOptions(false);
      }
    },
    [itens]
  );

  useEffect(() => {
    if (typeof value === "string") {
      const val = JSON.parse(value);

      if (val) {
        const keys = Object.keys(val);

        if (keys.length) {
          const key = Number(keys[0]);
          setValueInput(key);
          setValueSubopcao(val[key]);
          changeCampoResposta({ [key]: val[key] });
          showOrHideSuboptions(key);
        }
      }
    } else {
      setValueInput(value ? Number(value) : undefined);
    }
  }, [value, changeCampoResposta, showOrHideSuboptions]);

  const onChangeHandler = ({ target }) => {
    props.onChange(target.value);
    setValueSubopcao("");
    changeCampoResposta({ [target.value]: "" });
    showOrHideSuboptions(target.value);
  };

  return (
    <div style={props.descricao ? { margin: "20px 0px" } : {}}>
      {props.descricao && (
        <Row>
          <span style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.65)" }}>
            {props.descricao}
          </span>
        </Row>
      )}
      <Row>
        <Col span={24}>
          <Radio.Group {...props} value={valueInput} onChange={onChangeHandler}>
            {itens.map((item) => {
              return (
                <Radio style={itensStyle} key={item.id} value={item.id}>
                  {item.descricao}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
      </Row>
      {showSubOptions && (
        <>
          <Row>
            <label
              style={{
                color: "rgba(0, 0, 0, 0.65)",
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 12,
              }}
            >
              {labelSubopcao}
            </label>
          </Row>
          {idTipoOpcao && idTipoOpcao === tipoCampoResposta.textArea && (
            <Row>
              <Col span={24}>
                <FormTextArea
                  {...props}
                  value={valueSubopcao}
                  rows={5}
                  onChange={({ target }) => {
                    setValueSubopcao(target.value);
                    changeCampoResposta({
                      [valueInput]: target.value,
                    });
                  }}
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}

export function FormRadioRecorrencia(props) {
  const recorrenciaSelecionada = useSelector(
    ({ patrocinios }) => patrocinios.recorrenciaSelecionada
  );
  const dispatch = useDispatch();
  const { itens } = props;

  return (
    <>
      <Row>
        <Col flex="auto 0 0">
          <Radio.Group {...props}>
            {itens.map((item) => {
              return (
                <Radio style={itensStyle} key={item.id} value={item.id}>
                  {item.descricao}
                </Radio>
              );
            })}
          </Radio.Group>
        </Col>
        {recorrenciaSelecionada && (
          <Col flex="auto">
            <Button
              type="primary"
              onClick={() =>
                dispatch({
                  type: types.PATROCINIOS_VISIBLE_FORM_RECORRENCIA,
                  payload: true,
                })
              }
            >
              {`${recorrenciaSelecionada} - Alterar`}
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}

export function FormSimNaoSubperguntas(props) {
  const { value, itens, idsolicitacao } = props;

  const [valueInput, setValueInput] = useState("");
  const [showSubOptions, setShowSubOptions] = useState(false);

  const dispatch = useDispatch();

  const dispatchFiles = () => {
    itens.forEach((item) => {
      const { idTipoArquivo } = item;
      if (idTipoArquivo) {
        dispatch({
          type: types.PATROCINIOS_CHANGE_FILE_LIST,
          payload: [],
          idTipoArquivo,
        });
      }
    });
  };

  useEffect(() => {
    if (["Sim", "Não"].includes(value)) {
      setValueInput(value);
    } else if (Array.isArray(value)) {
      setValueInput("Sim");
    }

    setShowSubOptions(Array.isArray(value) || value === "Sim");
  }, [value]);

  const onChangeHandler = ({ target }) => {
    props.onChange(target.value);

    if (target.value === "Não") {
      dispatchFiles();
    }
  };

  return (
    <div style={props.descricao ? { margin: "20px 0px" } : {}}>
      {props.descricao && (
        <Row>
          <span style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.65)" }}>
            {props.descricao}
          </span>
        </Row>
      )}
      <Row>
        <Col span={24}>
          <Radio.Group {...props} value={valueInput} onChange={onChangeHandler}>
            <Radio style={itensStyle} value="Sim">
              Sim
            </Radio>
            <Radio style={itensStyle} value="Não">
              Não
            </Radio>
          </Radio.Group>
        </Col>
      </Row>
      {showSubOptions && (
        <Row>
          <Col span={24}>
            <FormCheckbox {...props} idsolicitacao={idsolicitacao} />
          </Col>
        </Row>
      )}
    </div>
  );
}

export class FormSelect extends React.Component {
  render() {
    const selected =
      this.props.itens.length === 1 ? this.props.itens[0].valor : null;

    return (
      <Select {...this.props} defaultValue={selected}>
        {this.props.itens.map((item) => {
          return (
            <Option
              key={item.id}
              value={item.id}
            >{`${item.id} - ${item.descricao}`}</Option>
          );
        })}
      </Select>
    );
  }
}

export function FormDatePicker(props) {
  return (
    <DatePicker
      {...props}
      format="DD/MM/YYYY"
      onChange={(date) => props.onChange(date)}
    />
  );
}

export function FormDatePrazo(props) {
  const { tiposolicitacao } = props;
  const [foraPrazo, setForaPrazo] = useState(false);

  const verificaPrazo = (date) => {
    const checkForaPrazo = checkDtEventoForaPrazo(tiposolicitacao, date);

    if (checkForaPrazo.error) {
      message.error(checkForaPrazo.error);
    } else {
      setForaPrazo(checkForaPrazo);
    }
  };

  const handleChangeDate = (date) => {
    props.onChange(date);
    verificaPrazo(date);
  };

  return (
    <>
      <Row>
        <Col flex="0 0 auto">
          <DatePicker
            {...props}
            format="DD/MM/YYYY"
            onChange={handleChangeDate}
          />
        </Col>
      </Row>
      {foraPrazo && (
        <Alert
          message="Atenção!"
          description="Evento fora do prazo de antecedência."
          type="warning"
          showIcon
          closable
          style={{ top: 15 }}
        />
      )}
    </>
  );
}

export const FormDatePrazoUpload = (props) => {
  const dispatch = useDispatch();
  const { uploadForaPrazo, tiposolicitacao } = props;

  const arquivos = useSelector(({ patrocinios }) => {
    const { arquivos } = patrocinios;
    return uploadForaPrazo &&
      uploadForaPrazo.idTipoArquivo &&
      arquivos[uploadForaPrazo.idTipoArquivo]
      ? arquivos[uploadForaPrazo.idTipoArquivo]
      : [];
  });

  const [upload, setUpload] = useState(false);
  const visibleAlert = upload && !arquivos.length;

  const foraPrazo = useCallback(
    (date) => {
      const foraPrazo = checkDtEventoForaPrazo(tiposolicitacao, date);

      if (foraPrazo.error) {
        message.error(foraPrazo.error);
      } else {
        setUpload(foraPrazo);

        if (!foraPrazo && arquivos.length) {
          dispatch({
            type: types.PATROCINIOS_CHANGE_FILE_LIST,
            payload: [],
            idTipoArquivo: uploadForaPrazo.idTipoArquivo,
          });
        }
      }
    },
    [arquivos.length, dispatch, tiposolicitacao, uploadForaPrazo]
  );

  const handleChangeDate = (date) => {
    props.onChange(date);

    if (uploadForaPrazo) {
      foraPrazo(date);
    }
  };

  useEffect(() => {
    if (props.value && uploadForaPrazo) {
      foraPrazo(props.value);
    }
  }, [props.value, uploadForaPrazo, foraPrazo]);

  return (
    <>
      <Row>
        <Col flex="0 0 auto">
          <DatePicker
            {...props}
            format="DD/MM/YYYY"
            onChange={handleChangeDate}
          />
        </Col>
        {upload && (
          <Col
            flex="auto"
            style={{ top: -35, maxHeight: 100, paddingLeft: 50 }}
          >
            <Row>
              <label
                style={{
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: "bold",
                  marginBottom: 12,
                }}
              >
                {uploadForaPrazo.descricao}
              </label>
            </Row>
            <Row>
              <FormUpload
                name={`file${uploadForaPrazo.idTipoArquivo}`}
                idTipoArquivo={uploadForaPrazo.idTipoArquivo}
                disabled={props.disabled}
              />
            </Row>
          </Col>
        )}
      </Row>
      {visibleAlert && (
        <Alert
          message="Atenção!"
          description="Evento fora do prazo de antecedência. Será necessário fazer upload da autorização da DIMAC."
          type="warning"
          showIcon
          closable
          style={{ top: 15 }}
        />
      )}
    </>
  );
};

export class FormMonthPicker extends React.Component {
  render() {
    return (
      <DatePicker.MonthPicker
        {...this.props}
        format="MM/YYYY"
        disabledDate={(current) => current < moment().subtract(1, 'month')}
      />
    );
  }
}

export class FormInputMoeda extends React.Component {
  render() {
    return <InputMoeda {...this.props} />;
  }
}

export class FormInputInteger extends React.Component {
  render() {
    return <InputInteger {...this.props} />;
  }
}

export class FormInputPrefixo extends React.Component {
  render() {
    return <InputPrefixo {...this.props} />;
  }
}

export class FormInputFunci extends React.Component {
  render() {
    return <InputFunci {...this.props} wholevalue="true" />;
  }
}

export class FormInputFuncisMultiplos extends React.Component {
  render() {
    return <InputFuncisMultiplos {...this.props} wholevalue="true" />;
  }
}

export class FormInputCNPJ extends React.Component {
  render() {
    return <InputCNPJ {...this.props} />;
  }
}

export class FormInputContaCorrente extends React.Component {
  render() {
    return <InputContaCorrente {...this.props} />;
  }
}
