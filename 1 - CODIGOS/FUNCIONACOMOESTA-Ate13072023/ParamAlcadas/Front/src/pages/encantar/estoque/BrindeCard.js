import React, { useState } from 'react';
import { Modal, Popconfirm, message, InputNumber, Checkbox, Input } from 'antd';
import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';
import { 
  FormOutlined, 
  DeleteOutlined, 
  ReadOutlined, 
  PlusSquareOutlined, 
  MinusSquareOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { moneyFormat, boolToText } from 'utils/Commons';
import { mascaraValorSemCentavos } from 'utils/Regex';
import { deleteBrindeCatalogo, mudarEstadoBrindeEstoque, deleteBrindeEstoque, alterarEstoqueBrinde } from 'services/ducks/Encantar.ducks';
import CommonStyles from "@/Commons.module.scss";
import styles from './BrindeCard.module.scss';
import ReactHtmlParser from 'react-html-parser';
import uuid from 'uuid/v4';
import './Carousel.css';

function BrindeCard(props) {
  const [loading, setLoading] = useState(false);
  const [showModalQuantity, setShowModalQuantity] = useState(false);
  const [showModalSelectQuantity, setShowModalSelectQuantity] = useState(false);
  const [tipoOperacao, setTipoOperacao] = useState("Adicionar");
  const [quantityValue, setQuantityValue] = useState(1);
  const [justificativa, setJustificativa] = useState("");
  const [modalQuantityKey, setModalQuantityKey] = useState(uuid());
  const [modalSelectQuantityKey, setModalSelectQuantityKey] = useState(uuid());

  function renderItemResumo(label, value, bottomLine = true) {
    const bottomLineClass = bottomLine ? "bottomLine" : "";

    return (
      <div className={`${CommonStyles.flexColumn} ${styles[bottomLineClass]}`}>
        <div className={CommonStyles.flexRow}>
          <label className={CommonStyles.headerSubtitle} style={{flex: 1}}>{label}</label>
          <label style={{alignSelf: "flex-end"}}>{value}</label>
        </div>
      </div>
    )
  }

  function onShowDescription() {
    const hasImages = props.data.imagens && props.data.imagens.length;
    const tempColumns = hasImages && props.data.imagens.length > 1 ? "1fr 1fr" : "1fr";

    return Modal.info({
      title: props.data.nome,
      width: 1000,
      content: (
        <div>
          <div className={CommonStyles.headerTitle}>Descrição do Brinde</div>
          <div>{ReactHtmlParser(props.data.descricao)}</div>
          {props.data.encantamento &&
            <div>
              <br />
              <div className={CommonStyles.headerTitle}>Frase de Encantamento</div>
              <div>{ReactHtmlParser(props.data.encantamento)}</div>
            </div>
          }

          {hasImages && 
            <div>
              <br />
              <div className={CommonStyles.headerTitle}>Imagens do Brinde</div>
              <div style={{
                display: "grid", 
                gridTemplateColumns: tempColumns, 
                justifyContent: "space-evenly",
                alignItems: "flex-start"}}>
                {props.data.imagens.map(imagem => {
                  return <img src={imagem.urlData} key={imagem.id} alt="imagem do brinde" style={{maxWidth: 450, height: "auto", display: "block", padding: 10}} />
                })}
              </div>
            </div>
          }
        </div>
      )
    })
  }

  function renderResumoInfo() {
    //verifica se algum parametro do resumo esta definido como true
    let showResume = false;

    for (let value of Object.keys(props.showResumoInfo)) {
      if (props.showResumoInfo[value] === true) {
        showResume = true;
        break;
      }
    }

    if (!showResume) {
      return null
    }

    const { valorEstimado, permiteMultiplos, limiteMinimo, limiteMaximo, fatorIncremento, validade, quantidadeSelecionada } = props.data;
    const showValorEstimado = props.showResumoInfo.valorEstimado;
    const showPermiteMultiplos = props.showResumoInfo.permiteMultiplos;
    const showValidade = props.showResumoInfo.validade;

    return (
      <div>
        <div className={CommonStyles.headerTitle}>Resumo</div>
        <div>
          { showValorEstimado && renderItemResumo("Vlr. Estimado", moneyFormat(valorEstimado), showPermiteMultiplos ? true : false ) }
          { showPermiteMultiplos && renderItemResumo("Permite Múltiplos", boolToText(permiteMultiplos), (permiteMultiplos || validade) ? true : false) }
          { (showPermiteMultiplos && permiteMultiplos !== 0) && renderItemResumo("Lim. Mímino", mascaraValorSemCentavos(limiteMinimo)) }
          { (showPermiteMultiplos && permiteMultiplos !== 0) && renderItemResumo("Lim. Máximo", mascaraValorSemCentavos(limiteMaximo))}
          { (showPermiteMultiplos && permiteMultiplos !== 0) && renderItemResumo("Fator Incremento", mascaraValorSemCentavos(fatorIncremento)) }
          { quantidadeSelecionada > 0 && renderItemResumo("Quant. Selecionada", mascaraValorSemCentavos(quantidadeSelecionada), validade ? true : false )}
          { showValidade && validade && renderItemResumo("Validade", validade, false) }
        </div>
      </div>
    )
  }

  function renderEstoqueInfo() {
    if (!props.showEstoqueInfo || !props.data.dadosEstoque) {
      return null
    }

    const { estoque, reserva } = props.data.dadosEstoque;
    const saldoFinal = estoque + reserva;

    return (
      <div>
        <div className={CommonStyles.headerTitle} style={{marginTop: 8}}>Estoque</div>
        <div>
          { renderItemResumo("Disponíveis", estoque) }
          { renderItemResumo("Reservas", reserva) }
          { renderItemResumo("Total (Disp. + Reser.)", saldoFinal, false) }
        </div>
      </div>
    )
  }

  function removerBrindeCatalogo() {
    setLoading(true);
    deleteBrindeCatalogo(props.data.id)
      .then(() => {
        message.success('Brinde removido com sucesso!');
        if (props.onBrindeRemoved) {
          props.onBrindeRemoved(props.data.id)
        }
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => setLoading(false))
  }

  function removerBrindeEstoque() {
    setLoading(true);
    deleteBrindeEstoque(props.data.dadosEstoque.id)
      .then(() => {
        message.success('Brinde removido com sucesso!');
        if (props.onBrindeRemoved) {
          props.onBrindeRemoved(props.data.id)
        }
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => setLoading(false))
  }

  function onBrindeEditedClick() {
    if (props.onBrindeEdited) {
      props.onBrindeEdited(props.data.id)
    }
  }

  function onAddQuantityClick() {
    const { permiteMultiplos, limiteMinimo } = props.data;
    setTipoOperacao("Adicionar");
    setJustificativa("");
    setModalQuantityKey(uuid());
    
    if (permiteMultiplos !== 0) {
      setQuantityValue(limiteMinimo)
    } else {
      setQuantityValue(1)
    }

    setShowModalQuantity(true);
  }

  function onRemoveQuantityClick() {
    const { permiteMultiplos, limiteMinimo } = props.data;   
    setTipoOperacao("Remover");
    setJustificativa("");
    setModalQuantityKey(uuid());
    
    if (permiteMultiplos !== 0) {
      setQuantityValue(limiteMinimo)
    } else {
      setQuantityValue(1)
    }

    setShowModalQuantity(true);
  }

  function renderActionButtons() {
    if (loading) {
      return null;
    }

    const actions = [<ReadOutlined key="read" title="Ver descrição" onClick={onShowDescription}/>];
    let { 
      canEdit, 
      canDeleteCatalogo, 
      canDeleteEstoque, 
      canSelect, 
      canDeselect, 
      canActivate, 
      canDeactivate, 
      canAddQuantity, 
      canRemoveQuantity,
      canCheck
    } = props.actionsConfig;

    const isActive = props.data.dadosEstoque && props.data.dadosEstoque.ativo === 1;

    if (canEdit) {
      actions.push(<FormOutlined title="Editar Brinde" onClick={onBrindeEditedClick} />);
    }

    if (canAddQuantity && isActive) {
      actions.push(<PlusCircleOutlined title="Adicionar Quantidade" onClick={onAddQuantityClick} />);
    }

    if (canRemoveQuantity && isActive) {
      actions.push(<MinusCircleOutlined title="Remover Quantidade" onClick={onRemoveQuantityClick} />);
    }

    if (canActivate && !isActive) {
      actions.push(
        <Popconfirm title="Deseja reativar este brinde?" onConfirm={onActivateClick} okText="Sim" cancelText="Não">
          <EyeOutlined title="Reativar Brinde" />
        </Popconfirm>
      );
    }

    if (canDeactivate && isActive) {
      actions.push(
        <Popconfirm title="Deseja desativar este brinde?" onConfirm={onDeactivateClick} okText="Sim" cancelText="Não" >
          <EyeInvisibleOutlined title="Desativar Brinde" />
        </Popconfirm>
      );
    }    

    if (canDeleteCatalogo) {
      actions.push(
        <Popconfirm title="Deseja remover este brinde do catálogo?" onConfirm={removerBrindeCatalogo} okText="Sim" cancelText="Não">
          <DeleteOutlined title="Remover Brinde" />
        </Popconfirm>
      )
    }

    if (canDeleteEstoque) {
      actions.push(
        <Popconfirm title="Deseja remover este brinde do estoque?" onConfirm={removerBrindeEstoque} okText="Sim" cancelText="Não">
          <DeleteOutlined title="Remover Brinde" />
        </Popconfirm>
      )
    }

    if (canSelect && !props.selected) {
      actions.push(<PlusSquareOutlined title="Selecionar Brinde" onClick={onTestBrindeSelected} />);
    }

    if (canDeselect && props.selected) {
      actions.push(
        <Popconfirm title="Deseja remover a seleção deste brinde?" onConfirm={onBrindeDeselected} okText="Sim" cancelText="Não">
          <MinusSquareOutlined title="Remover brinde selecionado" />
        </Popconfirm>
      );
    }

    if (canCheck && !props.selected) {
      actions.push(<Checkbox onChange={onCheckChange}>Selecionar</Checkbox>)
    }

    return actions;
  }

  function onTestBrindeSelected() {
    let { permiteMultiplos, limiteMinimo } = props.data;

    if (!permiteMultiplos) {
      if (props.onBrindeSelected) {
        props.onBrindeSelected({...props.data, quantidadeSelecionada: 1})
      }
    } else {
      //abre modal para permitir informar a quantidade
      setQuantityValue(limiteMinimo);
      setModalSelectQuantityKey(uuid());
      setShowModalSelectQuantity(true);
    }
  }

  function onBrindeDeselected() {
    if (props.onBrindeDeselected) {
      props.onBrindeDeselected(props.data)
    }
  }

  function onCheckChange(e) {
    if (e.target.checked) {
      props.onBrindeSelected(props.data)
    } else {
      props.onBrindeDeselected(props.data)
    }
  }

  function onChangeBrindeStatus(ativo) {
    setLoading(true);
    mudarEstadoBrindeEstoque(props.data.dadosEstoque.id, ativo)
      .then(() => {
        let termo = ativo ? "ativado" : "desativado";
        message.success(`Brinde ${termo} com sucesso!`);
        if (props.onBrindeStatusChanged) {
          props.onBrindeStatusChanged()
        }
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => setLoading(false))
  }

  function onActivateClick() {
    onChangeBrindeStatus(1)
  }

  function onDeactivateClick() {
    onChangeBrindeStatus(0)
  }

  function renderModalSelectWithQuantity() {
    const { permiteMultiplos, limiteMinimo, limiteMaximo, fatorIncremento } = props.data;

    return (
      <Modal
        title={"Informe a Quantidade"}
        width={400}
        maskClosable={false}
        centered={true}
        visible={showModalSelectQuantity}
        onCancel={() => setShowModalSelectQuantity(false)}
        key={modalSelectQuantityKey}
        onOk={onSelectWithQuantity}
      >
        <div>
          { renderItemResumo("Permite Múltiplos", boolToText(permiteMultiplos)) }
          { renderItemResumo("Lim. Mímino", mascaraValorSemCentavos(limiteMinimo)) }
          { renderItemResumo("Lim. Máximo", mascaraValorSemCentavos(limiteMaximo))}
          { renderItemResumo("Fator Incremento", mascaraValorSemCentavos(fatorIncremento),  true) }

          <div className={CommonStyles.flexColumn}>
            <div className={CommonStyles.flexRow}>
              <label className={CommonStyles.headerSubtitle} style={{flex: 1, fontWeight: 'bold', alignSelf: 'center'}}>Quantidade:</label>
              <div style={{alignSelf: "flex-end"}}>
                <InputNumber 
                  min={limiteMinimo}
                  step={(permiteMultiplos !== 0) ? fatorIncremento : 1}
                  defaultValue={quantityValue} 
                  onChange={value => setQuantityValue(value)}
                  autoFocus={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  function onSelectWithQuantity() {
    const { permiteMultiplos, fatorIncremento } = props.data;

    if (permiteMultiplos !== 0 && (quantityValue % fatorIncremento !== 0)) {
      message.error("Valor informado não é múltiplo do fator de incremento!");
      return;
    }

    let { estoque, reserva } = props.data.dadosEstoque;
      
    if (quantityValue > (estoque - reserva)) {
      message.error("Quantidade selecionada não está disponível!");
      return;
    } 

    setShowModalSelectQuantity(false);

    if (props.onBrindeSelected) {
      props.onBrindeSelected({...props.data, quantidadeSelecionada: quantityValue})
    }
  }

  function renderModalChangeQuantity() {
    const { permiteMultiplos, limiteMinimo, limiteMaximo, fatorIncremento } = props.data;
    const isRemoverQtd = tipoOperacao === "Remover";

    return (
      <Modal
        title={`${tipoOperacao} Quantidade`}
        width={400}
        maskClosable={false}
        centered={true}
        visible={showModalQuantity}
        onCancel={() => setShowModalQuantity(false)}
        key={modalQuantityKey}
        onOk={ChangeEstoqueQuantity}
      >
        <div>
          { renderItemResumo("Permite Múltiplos", boolToText(permiteMultiplos)) }
          { (permiteMultiplos !== 0) && renderItemResumo("Lim. Mímino", mascaraValorSemCentavos(limiteMinimo)) }
          { (permiteMultiplos !== 0) && renderItemResumo("Lim. Máximo", mascaraValorSemCentavos(limiteMaximo))}
          { (permiteMultiplos !== 0) && renderItemResumo("Fator Incremento", mascaraValorSemCentavos(fatorIncremento),  true) }

          <div className={CommonStyles.flexColumn}>
            <div className={CommonStyles.flexRow}>
              <label className={CommonStyles.headerSubtitle} style={{flex: 1, fontWeight: 'bold', alignSelf: 'center'}}>Quantidade:</label>
              <div style={{alignSelf: "flex-end"}}>
                <InputNumber 
                  min={limiteMinimo}
                  step={(permiteMultiplos !== 0) ? fatorIncremento : 1}
                  defaultValue={quantityValue} 
                  onChange={value => setQuantityValue(value)}
                  autoFocus={true}
                />
              </div>
            </div>

            { isRemoverQtd &&
              <div>
                <label className={CommonStyles.headerSubtitle} style={{flex: 1, fontWeight: 'bold', alignSelf: 'center'}}>Justificativa:</label>
              </div>
            }

            { isRemoverQtd &&
              <div>
                <Input.TextArea rows={4} onChange={onJustificativaChange} />
              </div>
            }
          </div>

        </div>
      </Modal>
    )
  }

  function onJustificativaChange(e) {
    setJustificativa(e.target.value)
  }

  function ChangeEstoqueQuantity() {
    //verificando se o valor informado eh multiplo do fator de incremento
    const { permiteMultiplos, fatorIncremento } = props.data;

    if (permiteMultiplos !== 0 && (quantityValue % fatorIncremento !== 0)) {
      message.error("Valor informado não é múltiplo do fator de incremento!");
      return;
    }

    if (tipoOperacao === "Remover") {
      let { estoque, reserva } = props.data.dadosEstoque;
      
      if (quantityValue > (estoque - reserva)) {
        message.error("Quantidade a remover maior que o valor saldo atual em estoque!");
        return;
      }

      if (!justificativa.length) {
        message.error("Necessário informar a justificativa para reduzir o estoque!");
        return;
      }

      if (justificativa.length < 15) {
        message.error("A justificativa informada ainda está incompleta, favor adicionar mais informações.");
        return;
      }
    }

    let { id:idEstoque } = props.data.dadosEstoque; 
    setShowModalQuantity(false);
    setLoading(true);

    alterarEstoqueBrinde({ idEstoque, quantidade: quantityValue, tipoOperacao, justificativa})
      .then(() => {
        message.success("Estoque alterado com sucesso!");

        if (tipoOperacao === "Adicionar") {
          if (props.onBrindeAddQuantity) {
            props.onBrindeAddQuantity(props.data.dadosEstoque.id)
          }
        } else {
          if (props.onBrindeRemoveQuantity) {
            props.onBrindeRemoveQuantity(props.data.dadosEstoque.id)
          }          
        }
      })
      .catch((error) => {
        message.error(error)
      })
      .then(() => {
        setLoading(false)
      })
  }

  const isInativo = props.data.dadosEstoque && props.data.dadosEstoque.ativo === 0;
  const tituloBrinde = isInativo ? props.data.nome + " - [INATIVO]" : props.data.nome;
  const estiloInativo = isInativo ? {backgroundColor: 'rgb(207, 217, 234)'} : {};

  return (
    <div className={`${styles.brindeContainer}`}>
      <StyledCardPrimary 
        title={tituloBrinde}
        size="small"
        actions={renderActionButtons()}
        loading={loading}
        style={props.highLightSelected ? {border: '4px solid #52c41a', ...estiloInativo} : {...estiloInativo}}
      >
        <Carousel arrows dots>
          {props.data.imagens.map(imagem => {
            return <img src={imagem.urlData} key={imagem.id} alt="imagem do brinde" style={{width: "100%", height: "auto", display: "block", padding: 10}} />
          })}
        </Carousel>
        {renderResumoInfo()}
        {renderEstoqueInfo()}
        {renderModalChangeQuantity()}
        {renderModalSelectWithQuantity()}
      </StyledCardPrimary>
    </div>
  )
}

BrindeCard.defaultProps = {
  showResumoInfo: {
    valorEstimado: false,
    permiteMultiplos: false,
    validade: false
  },
  showEstoqueInfo: false,
  data: {},
  selected: false, //flag de item selecionado
  highLightSelected: false, //realca a selecao com uma borda
  actionsConfig: {
    canEdit: false,
    canDeleteCatalogo: false,
    canDeleteEstoque: false,
    canSelect: false,
    canDeselect: false,
    canActivate: false,
    canDeactivate: false,
    canAddQuantity: false,
    canRemoveQuantity: false,
    canCheck: false
  }
}

export default BrindeCard
