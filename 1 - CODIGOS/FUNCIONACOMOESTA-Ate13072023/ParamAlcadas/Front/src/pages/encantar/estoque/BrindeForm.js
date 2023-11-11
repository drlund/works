import React, { useState } from 'react';
import { Tabs, Button, Modal, Alert, Input, DatePicker, Select, Switch, InputNumber, message } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import QuestionHelp from 'components/questionhelp/QuestionHelp';
import history from "@/history.js";
import CommonStyles from "@/Commons.module.scss";
import RichEditor from "components/richeditor/RichEditor";
import Cropper from 'components/cropper/TratarImagem';
import AlertList from 'components/alertlist/AlertList';
import { mascaraValor, doubleToMoeda } from 'utils/Regex';
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import "moment/locale/pt-br";
import BrindeFormImagesList from './BrindeFormImagesList';
import { salvarDadosBrinde } from 'services/ducks/Encantar.ducks';

const { TabPane } = Tabs;
const Option = Select.Option;

function BrindeForm(props) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ...props.formData, 
    valorEstimado: doubleToMoeda(props.formData.valorEstimado),
    imagensExcluir: [],
    imagens: props.formData.imagens.map(elem => { return { ...elem, isNew: false } }),
    validade: props.formData.validade ? moment(props.formData.validade, "DD/MM/YYYY") : null,
    permiteMultiplos: props.formData.permiteMultiplos ? 1 : 0,
    limiteMinimo: props.formData.limiteMinimo || 1,
    limiteMaximo: props.formData.limiteMaximo || 1,
    fatorIncremento: props.formData.fatorIncremento || 1
  });
  const [showModalCropper, setShowModalCropper] = useState(false);
  const [errorsList, setErrorsList] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState("1");

  function setFormItemValue(key, value) {
    setFormData({...formData, [key]: value});
  }

  function gotoCatalogo() {
    history.push("/encantar/catalogo")
  }

  function onCancelarClick() {
    Modal.confirm({
      title: "Confirmar Cancelamento",
      content: "Deseja descartar as alterações realizadas neste brinde?",
      okText: "Sim",
      cancelText: "Não",
      centered: true,
      onOk: gotoCatalogo
    })    
  }

  function onPermiteMultiplosChange(checked) {
    setFormItemValue("permiteMultiplos", checked ? 1 : 0);
  }

  function renderActions() {
    return (
      <div>
        <Button 
          type="primary" 
          style={{marginRight: '10px'}}
          onClick={onSaveBrinde}
          loading={saving}
        >
          Salvar Brinde
        </Button>

        <Button 
          disabled={saving}
          onClick={onCancelarClick}
        >
          Cancelar
        </Button>
      </div>
    )
  }

  function renderDadosBasicos() {
    if (saving) {
      return (
        <div style={{ height: "600px"}}>
          <div style={{paddingLeft: "20px"}}>
            <Alert message="Salvando os dados do brinde. Aguarde..." type="info" showIcon />
          </div>
          <PageLoading />
        </div>
      )
    }

    return (
      <div className={CommonStyles.flexColumn} style={{padding: 10, paddingTop: 0}}>
        { errorsList.length > 0 &&
          <AlertList title="Erros de Preenchimento do Formulário" messagesList={errorsList} style={{marginBottom: 15}} />
        }

        <div className={CommonStyles.flexRow} style={{marginBottom: 15}}>
          <div className={CommonStyles.flexColumn} style={{flex: "1 1 60%", flexGrow: 0, paddingRight: 10}}>
            <div className={CommonStyles.headerText}>Nome</div>
              <Input 
                placeholder="Digite o nome do brinde" 
                value={formData.nome} 
                onChange={(e) => setFormItemValue("nome", e.target.value) } 
                allowClear={true} 
              />
          </div>

          <div className={CommonStyles.flexColumn} style={{flex: "1 1 40%", flexGrow: 0, maxWidth: 250}}>
            <div className={CommonStyles.headerText}>Validade (opcional)</div>
            <DatePicker 
              defaultValue={formData.validade}
              format="DD/MM/YYYY"
              showToday
              disabledDate={(current) =>
                current < moment().subtract(1, "day")
              }
              onChange={(data) => {
                if (data) {
                  setFormItemValue("validade", data)
                } else {
                  setFormItemValue("validade", null)
                }
              }}
            />
          </div>
        </div>

        <div className={CommonStyles.flexRow} style={{marginBottom: 15}}>
          <div className={CommonStyles.flexColumn} style={{flex: "1 1 20%", flexGrow: 0, paddingRight: 10}}>
            <div className={CommonStyles.headerText}>Tipo de Unidade</div>
            <Select value={formData.tipo} onChange={(value) => setFormItemValue("tipo", value) }>
              <Option value="quantidade">Quantidade</Option>
              <Option value="valor">Valor</Option>
            </Select>
          </div>

          <div className={CommonStyles.flexColumn} style={{flex: "1 1 20%", flexGrow: 0, paddingRight: 10}}>
            <div className={CommonStyles.headerText}>Valor (Estimado)</div>
              <Input 
                placeholder="0,00" 
                addonBefore="R$"
                value={formData.valorEstimado || ""} 
                onChange={(e) => setFormItemValue("valorEstimado", mascaraValor(e.target.value)) } 
                allowClear={false} 
                dir="rtl"
              />
          </div>

          <div className={CommonStyles.flexColumn} style={{flex: "1 1 22%", flexGrow: 0, paddingRight: 10}}>
            <div className={CommonStyles.headerText}>
              Permite Múltiplos?
              <QuestionHelp
                title="Caso esta opção seja marcada, cada solicitação do brinde poderá ser incluída pelo limite mínimo até o limite máximo, com incremento pelo valor de fator incremento. Exemplo: Pontos Livelo: Lim. Mínimo: 100, Lim. Máximo: 5000, Fator de Incremento: 100 (aumenta de 100 em 100 até 5000)"
                style={{ marginLeft: 10 }}
                contentWidth={550}
                placement="top"
              />
            </div>
            <div className={CommonStyles.flex} style={{justifyContent: 'flex-start', paddingLeft: '20%', marginTop: 5, marginRight: 30}}>
              <Switch 
                defaultChecked={formData.permiteMultiplos === 1 ? true : false} 
                onChange={onPermiteMultiplosChange} 
              />
            </div>
          </div>
          
            <div className={CommonStyles.flexColumn} style={{flex: "1 1 15%", flexGrow: 0, paddingRight: 10}}>
              { formData.permiteMultiplos !== 0 && 
                <React.Fragment>
                  <div className={CommonStyles.headerText}>Lim. Mínimo</div>
                  <InputNumber 
                    min={1}
                    value={formData.limiteMinimo || 1} 
                    onChange={(value) => setFormItemValue("limiteMinimo", value) }
                    disabled={formData.permiteMultiplos === 0}
                  />
                </React.Fragment>
              }
            </div>

            <div className={CommonStyles.flexColumn} style={{flex: "1 1 15%", flexGrow: 0, paddingRight: 10}}>
              { formData.permiteMultiplos !== 0 && 
                <React.Fragment>
                  <div className={CommonStyles.headerText}>Lim. Máximo</div>
                  <InputNumber 
                    min={1}
                    value={formData.limiteMaximo || 1} 
                    onChange={(value) => setFormItemValue("limiteMaximo", value) }
                    disabled={formData.permiteMultiplos === 0}
                  />
                </React.Fragment>
              }
            </div>

            <div className={CommonStyles.flexColumn} style={{flex: "1 1 20%", flexGrow: 0, paddingRight: 10}}>
              { formData.permiteMultiplos !== 0 && 
                <React.Fragment>
                  <div className={CommonStyles.headerText}>Fator Incremento</div>
                  <InputNumber 
                    min={1}
                    value={formData.fatorIncremento || 1} 
                    onChange={(value) => setFormItemValue("fatorIncremento", value) }
                  />
                </React.Fragment>
              }
            </div>

        </div>

        <div className={CommonStyles.flexColumn} style={{marginBottom: 15}}>
          <Tabs type="card">
            <TabPane key="descricao" tab="Descrição">
              <RichEditor
                height={300}
                width={"100%"}
                onBlur={(evt) => setFormItemValue("descricao", evt.target.getContent())}
                initialValue={formData.descricao}
              />              
            </TabPane>
            <TabPane key="encantamento" tab="Frase de Encantamento">
              <RichEditor
                height={300}
                width={"100%"}
                onBlur={(evt) => setFormItemValue("encantamento", evt.target.getContent())}
                initialValue={formData.encantamento}
              />              
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }

  function onNewImageClick() {
    setShowModalCropper(true)
  }

  function onRemoveImage(id, isNew) {
    if (!isNew) {
      let newImagensExcluir = [...formData.imagensExcluir, id];
      setFormData({...formData, imagensExcluir: [...newImagensExcluir]});
    } else {
      let newImagensList = formData.imagens.filter(elem => elem.id !== id);
      setFormItemValue("imagens", newImagensList);  
    }
  }

  function onAddNewImage(croppedImage) {
    let newImg = {
      id: Date.now(),
      isNew: true,
      urlData: croppedImage
    }

    let newImagesList = [...formData.imagens, newImg];
    setFormItemValue("imagens", [...newImagesList]);
    setShowModalCropper(false);
  }

  function renderModalCropper() {
    return (
      <Modal
        title="Nova Imagem"
        visible={showModalCropper}
        footer={null}
        onCancel={() => setShowModalCropper(false)}
        width="80%"
        centered
        bodyStyle={{paddingTop: 10, minHeight: 500}}
        maskClosable={false}
      >
        <Cropper 
          key={Date.now()}
          aspect= {1}
          cropWidth= {600}
          cropHeight= {600}
          showAlerts={false}  
          onCrop={onAddNewImage}
        />
      </Modal>
    )
  }

  function renderAbaImagens() {
    return (
      <div className={CommonStyles.flexColumn}>
        <div className={CommonStyles.flexRow} style={{marginBottom: 15}}>
            <Button icon={<PlusOutlined />} type="primary" onClick={onNewImageClick}>Nova Imagem</Button>
        </div>

        <div className={CommonStyles.flexColumn}>
          <BrindeFormImagesList 
            listData={formData.imagens} 
            excludesList={formData.imagensExcluir} 
            onRemoveImage={onRemoveImage}
          />
        </div>
      </div>
    )
  }

  function getFormDataErrors() {
    let errorsList = [];

    if (!formData.nome || formData.nome.trim() === '') {
      errorsList.push("Necessário o nome do brinde")
    }

    if (!formData.descricao || formData.descricao.trim() === "") {
      errorsList.push("Necessária a descrição do brinde")
    }

    if ((formData.imagens.length - formData.imagensExcluir.length) === 0) {
      errorsList.push("Inclua ao menos uma imagem para este brinde.")
    }

    setErrorsList(errorsList);
    return errorsList.length;
  }

  function onSaveBrinde() {
    setSaving(true);
    let hasErrors = getFormDataErrors();

    if (!hasErrors) {
      //pode salvar este brinde
      setActiveTabKey("1");
      salvarDadosBrinde(formData)
        .then(() => {
          message.success("Brinde salvo com sucesso!");
        })
        .catch(error => message.error(error))
        .then(() => {
          setSaving(false);    
        })
    } else {
      message.error("Exitem erros no preenchimento dos dados! Favor verificar.");
      setActiveTabKey("1");
      setSaving(false);
    }
  }

  function onTabChange(activeKey) {
    setActiveTabKey(activeKey);
  }

  return (
    <Tabs type="card" activeKey={activeTabKey} onChange={onTabChange} tabBarExtraContent={renderActions()}>
      <TabPane key="1" disabled={saving} tab="Dados Básicos">
        {renderDadosBasicos()}
      </TabPane>
      <TabPane key="2" disabled={saving} tab={`Imagens (${formData.imagens.length - formData.imagensExcluir.length})`}>
        {renderModalCropper()}
        {renderAbaImagens()}
      </TabPane>
    </Tabs>
  )
}

BrindeForm.defaultProps = {
  formData: {
    tipo: "quantidade",
    valorEstimado: 0,
    permiteMultiplos: 0,
    limiteMinimo: 1,
    limiteMaximo: 1,
    fatorIncremento: 1,
    imagens: [
      // {id: 1, isNew: false, urlData: "http://127.0.0.1:3333/get-image/encantar/4df0cdb49e4496d0a8b39a239854bd2f"},
    ]
  }
}

export default BrindeForm
