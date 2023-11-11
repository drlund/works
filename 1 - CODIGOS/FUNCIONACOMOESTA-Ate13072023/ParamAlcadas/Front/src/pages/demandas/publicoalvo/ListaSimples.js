import React, { Component } from "react";
import { DeleteOutlined, QuestionCircleTwoTone } from "@ant-design/icons";
import {
  Input,
  Button,
  Row,
  Col,
  Popconfirm,
  message,
  Checkbox,
  Tooltip,
  Modal,
} from "antd";

import AlertList from "components/alertlist/AlertList";
import InfoLabel from "components/infolabel/InfoLabel";
import { DefaultGutter, capitalizeName } from "utils/Commons";
import _ from "lodash";
import SearchTable from "components/searchtable/SearchTable";
import { testeMatricula, testePrefixo } from "utils/Regex";
import PageLoading from "components/pageloading/PageLoading";
import QuestionHelp from 'components/questionhelp'
import uuid from "uuid/v4";

class ListaSimples extends Component {
  static propName = "publicoAlvo";
  static separators = [";", ",", "\n"];

  constructor(props) {
    super(props);

    this.state = {
      stringPublico: "",
      duplicados: {
        prefixos: [],
        matriculas: [],
      },
    };

    if (_.isEmpty(this.props.publicoAlvo)) {
      let initialState = {
        publicos: { prefixos: [], matriculas: [] },
        multiplaPorPrefixo: true,
      };
      this.props.updateFormData(ListaSimples.propName, initialState);
    }
  }
  /**
   *
   *  Método responsável por realizar as validações básicas da lista de matrículas/prefixos.
   *
   *  No caso de matrícula, verifica se está no formato F0000000. No caso de prefixo verifica se é numérico e se tem no máximo 4 dígitos
   */

  validarLista = () => {
    this.props.loadingFunc(true);

    let separatorUsed = { counter: 0, separator: "" };
    let stringPublico = this.state.stringPublico;

    if (!stringPublico || stringPublico.trim().length === 0) {
      message.error("Preencha o campo de matrículas/prefixos");
      this.props.loadingFunc(false);
      return;
    }

    let publicoAlvo = { ...this.props.publicoAlvo };
    let duplicados = {
      prefixos: [],
      matriculas: [],
    };

    let inclusaoNaoPermitida = false;

    //Laço que conta quantas ocorrências existem da cada separador. Aquele com o maior número de ocorrências será considerado o separador utilizado
    ListaSimples.separators.forEach((separator) => {
      let regex = new RegExp(separator, "g");
      let totalMatches = (stringPublico.match(regex) || []).length;

      if (totalMatches > separatorUsed.counter) {
        separatorUsed.counter = this.state.stringPublico.match(regex).length;
        separatorUsed.separator = separator;
      }
    });

    //Caso em que nenhum dos separadores foi utilizado
    var arrayIdentificadores =
      separatorUsed.counter === 0
        ? [stringPublico]
        : stringPublico.split(separatorUsed.separator);
    //arrayIdentificadores.forEach( elemento => {
    for (let elemento of arrayIdentificadores) {
      let tipo = null;

      if (testeMatricula.test(elemento)) {
        tipo = "matriculas";
      }

      if (testePrefixo.test(elemento)) {
        tipo = "prefixos";
        elemento = elemento.padStart(4, "0");
      }

      if (tipo) {
        // Caso seja duplicado, inclui na listagem de duplicados. Caso contrário inclui no público alvo.
        if (publicoAlvo[tipo].includes(elemento.toUpperCase())) {
          duplicados[tipo].push(elemento);
        } else {
          if (
            tipo === "matriculas" &&
            this.props.publicoAlvo.multiplaPorPrefixo === false
          ) {
            inclusaoNaoPermitida = true;
          } else {
            publicoAlvo[tipo].push(elemento.toUpperCase());
          }
        }
      }
    }

    //Separa as linhas do publico entre prefixos e matrículas
    this.setState(
      {
        duplicados: duplicados,
        stringPublico: "",

        inclusaoNaoPermitida: inclusaoNaoPermitida,
      },
      () => {
        this.props.updateFormData(ListaSimples.propName, {
          ...this.props.publicoAlvo,
          multiplaPorPrefixo:
            publicoAlvo.matriculas && publicoAlvo.matriculas.length > 0
              ? true
              : this.props.multiplaPorPrefixo,
          publicos: publicoAlvo,
        });
        this.props.loadingFunc(false);
      }
    );
  };

  limparLista = (tipo) => {
    if (tipo === "prefixos") {
      this.props.updateFormData(ListaSimples.propName, {
        ...this.props.publicoAlvo,
        multiplaPorPrefixo: true,
        publicos: { ...this.props.publicoAlvo, prefixos: [] },
      });
    } else {
      this.props.updateFormData(ListaSimples.propName, {
        ...this.props.publicoAlvo,
        publicos: { ...this.props.publicoAlvo, matriculas: [] },
      });
    }
  };

  /**
   *   Método para gerar o array com os prefixos e/ou matrículas duplicadas. Será utilizado no alertList
   *
   */

  geraMsgDuplicadas = () => {
    let arrayMsgs = [];

    if (this.state.duplicados.prefixos.length > 0) {
      arrayMsgs.push("Prefixos: " + this.state.duplicados.prefixos.join(", "));
    }

    if (this.state.duplicados.matriculas.length > 0) {
      arrayMsgs.push(
        "Matriculas: " + this.state.duplicados.matriculas.join(", ")
      );
    }

    return arrayMsgs;
  };

  onRemovePublico(identificadorPublico, tipoPublico) {
    let listaFiltrada = _.filter(
      this.props.publicoAlvo[tipoPublico],
      (elem) => {
        return elem !== identificadorPublico;
      }
    );
    this.props.updateFormData(ListaSimples.propName, {
      ...this.props.publicoAlvo,
      publicos: { ...this.props.publicoAlvo, [tipoPublico]: listaFiltrada },
    });
  }

  onMultiplaChange = (event) => {
    let isChecked = !event.target.checked;

    if (!isChecked && this.props.publicoAlvo.matriculas.length) {
      this.onShowMultiplaPrefixoDialog();
    } else {

      if(isChecked){
        this.props.updateFormData(ListaSimples.propName, {
          respostaUnica: false,
        });  
      }

      this.props.updateFormData(ListaSimples.propName, {
        multiplaPorPrefixo: isChecked,
      });
    }
  };

  renderTabelasPublico = () => {
    let tabelas = [];

    _.forIn(this.props.publicoAlvo, (arrayPublicoAlvo, key) => {
      if (arrayPublicoAlvo.length === 0) {
        return;
      }

      let columns = [
        {
          title: _.upperFirst(key),
          dataIndex: "identificador",
        },
        {
          title: "Excluir",
          width: 60,
          align: "center",
          render: (text, record) => {
            return (
              <span>
                <Popconfirm
                  title="Deseja excluir do público alvo?"
                  onConfirm={() => {
                    this.onRemovePublico(record.identificador, key);
                  }}
                >
                  <DeleteOutlined className="link-color" />
                </Popconfirm>
              </span>
            );
          },
        },
      ];

      let dadosTabela = arrayPublicoAlvo.map((elem) => {
        return { identificador: elem };
      });
      let capitalizedKey = capitalizeName(key);

      tabelas.push(
        <Col xs={24} sm={24} md={12} lg={12} xl={7} key={uuid()}>
          {key === "prefixos" ? (
            <React.Fragment>
              <Checkbox
                checked={!this.props.multiplaPorPrefixo}
                style={{ marginBottom: "10px" }}
                onChange={this.onMultiplaChange}
              >
                Apenas uma resposta por prefixo?
              </Checkbox>
              <Tooltip
                placement="top"
                title="Caso marcado, cada prefixo será considerado como público alvo. Caso contrário, cada funcionário do prefixo será considerado público alvo."
              >
                <QuestionCircleTwoTone />
              </Tooltip>
            </React.Fragment>
          ) : (
            <div style={{ marginBottom: "10px" }}>&nbsp;</div>
          )}

          <SearchTable
            columns={columns}
            dataSource={dadosTabela}
            size="small"
            pagination={{ showSizeChanger: true }}
          />

          <Popconfirm
            title={`Deseja limpar a lista de ${key}?`}
            onConfirm={() => this.limparLista(key)}
          >
            <Button type="primary">{`Limpar ${capitalizedKey}`}</Button>
          </Popconfirm>
        </Col>
      );
    });

    return tabelas.length > 0 ? tabelas : "";
  };

  onShowMultiplaPrefixoDialog = () => {
    Modal.confirm({
      title: "Alerta",
      centered: true,
      maskClosable: false,
      onOk: this.onDeleteMatriculas,
      width: 485,
      content: (
        <p>
          Ao marcar a opção <strong>"Apenas uma resposta por prefixo"</strong>,
          somente a lista de prefixos poderá ser informada.
          <br />
          <InfoLabel type="error" showIcon={false}>
            Atenção: As matrículas serão apagadas.
          </InfoLabel>
          <br />
          <br />
          Deseja continuar?
          <br />
        </p>
      ),
    });
  };

  onDeleteMatriculas = () => {
    //marca os prefixos como multiplaPorPrefixo = false e limpa a lista de matriculas
    this.props.updateFormData(ListaSimples.propName, {
      ...this.props.publicoAlvo,
      multiplaPorPrefixo: false,
      publicos: { ...this.props.publicoAlvo, matriculas: [] },
    });
  };

  onPublicoListChange = (value) => {
    this.setState({ stringPublico: value });
  };

  setRespostaUnica = (value) => {

    const isChecked = !this.props.respostaUnica;

    if(this.props.jaRespondida && isChecked === true){
      Modal.warning({
        title: 'Esta demanda já possui respostas cadastradas, perigo de exclusão das mesmas.',
        content: 'Caso a demanda atualmente esteja configurada para permitir múltiplas respostas e se altere para uma única respostas, as respostas já salvas serão apagadas.',
      });
    }

    if(isChecked === false){
      this.props.updateFormData(ListaSimples.propName, { respostaUnica: isChecked,  multiplaPorPrefixo: true  });
    }else{

      this.props.updateFormData(ListaSimples.propName, { respostaUnica: isChecked });
    }
  };

  render = () => {

    if (!this.props.publicoAlvo) {
      return <PageLoading />;
    }

    return (
      <div>
        <Row gutter={DefaultGutter} type="flex">
          <Col span={24} style={{ marginBottom: 20 }}>
            <Checkbox
              defaultChecked={this.props.respostaUnica}
              checked={this.props.respostaUnica === undefined ? true : this.props.respostaUnica}
              onChange={(e) => this.setRespostaUnica(e.target.checked)}
            >
              Resposta Única
            </Checkbox>
              <QuestionHelp
                title="Caso esta opção seja marcada, cada membro do público alvo só poderá responder uma única vez. Caso contrário, a demanda poderá ser respondida múltiplas vezes, enquanto a mesma estiver ativa"
                style={{ marginLeft: 20 }}
                contentWidth={550}
                placement="bottomRight"
              />
          </Col>
          <Col xs={24} sm={24} md={12} lg={{ span: 12 }} xl={6}>
            <p> Cole a lista de Matrículas e/ou Prefixos abaixo.</p>
            <Input.TextArea
              style={{ marginBottom: 18 }}
              rows={13}
              value={this.state.stringPublico}
              onChange={(e) => this.onPublicoListChange(e.target.value)}
            />
            <Button type="primary" onClick={() => this.validarLista()}>
              Incluir
            </Button>
          </Col>
          {this.renderTabelasPublico()}
        </Row>

        <Row gutter={DefaultGutter} style={{ marginTop: "15px" }}>
          <Col span={24}>
            <AlertList
              closable={true}
              title="O seguintes registros foram ignorados por estarem em duplicidade"
              type="warning"
              messagesList={this.geraMsgDuplicadas()}
            />
            <AlertList
              title="Erros Encontrados"
              messagesList={this.props.errorsList}
            />
          </Col>
        </Row>

        <Modal
          title="Aviso"
          visible={this.state.inclusaoNaoPermitida}
          centered
          closable
          footer={[
            <Button
              key="btnOK"
              type="primary"
              onClick={() => this.setState({ inclusaoNaoPermitida: false })}
            >
              OK
            </Button>,
          ]}
        >
          <p>
            A opção <strong>"Apenas uma resposta por prefixo</strong> está
            marcada.
          </p>
          <InfoLabel type="error">
            Neste caso <strong>matrículas</strong> não podem ser adicionadas ao
            público-Alvo.
          </InfoLabel>
        </Modal>
      </div>
    );
  };
}

export default ListaSimples;
